import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemSelectedValue } from './entities/order-item-selected-value.entity';
import { CartService } from '../cart/cart.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm/browser';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus, PaymentStatus } from './enums/order.enum';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private cartService: CartService,
    @InjectDataSource() private datasource: DataSource,
  ) {}

  private validatePickupDate(pickupDateInput: Date | string): void {
    const pickupDate = new Date(pickupDateInput);

    if (isNaN(pickupDate.getTime())) {
      throw new BadRequestException('Invalid pickup date provided.');
    }

    pickupDate.setHours(0, 0, 0, 0);
    const minAllowedDate = new Date();
    minAllowedDate.setDate(minAllowedDate.getDate() + 1);
    minAllowedDate.setHours(0, 0, 0, 0);

    if (pickupDate.getTime() < minAllowedDate.getTime()) {
      throw new BadRequestException(
        'Pickup date must be at least 1 day in advance (earliest pickup is tomorrow).',
      );
    }
  }

  async createOrder(userId: number, dto: CreateOrderDto) {
    this.validatePickupDate(dto.pickupDate);

    const cart = await this.cartService.getCartEntities(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cannot check out an empty cart.');
    }
    return this.datasource.transaction(async (manager) => {
      const order = manager.create(Order, {
        userId,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.UNPAID,
        pickupDate: dto.pickupDate,
        pickupTime: dto.pickupTime,
        totalPrice: 0,
      });
      const savedOrder = await manager.save(order);

      let totalPrice = 0;

      for (const item of cart.items) {
        const optionsTotal = item.itemSelectedValue.reduce(
          (sum, sv) => sum + Number(sv.value.priceModifier),
          0,
        );
        const unitPrice = Number(item.cake.basePrice) + optionsTotal;
        const lineTotal = unitPrice * item.quantity;
        totalPrice += lineTotal;

        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          cakeId: item.cakeId,
          cakeName: item.cake.name,
          quantity: item.quantity,
          notes: item.notes,
          unitPrice,
          lineTotal,
        });
        const savedItem = await manager.save(orderItem);

        const selectedValues = item.itemSelectedValue.map((sv) =>
          manager.create(OrderItemSelectedValue, {
            orderItemId: savedItem.id,
            cakeOptionValueId: sv.value.id,
            label: sv.value.label,
            priceModifier: sv.value.priceModifier,
          }),
        );
        await manager.save(selectedValues);
      }

      savedOrder.totalPrice = totalPrice;
      await manager.save(savedOrder);

      await manager.delete(CartItem, { cartId: cart.id });

      return savedOrder;
    });
  }

  async findOrders(userId: number, role: string) {
    if (role === 'owner') {
      return await this.orderRepo.find({
        order: { createdAt: 'DESC' },
      });
    }
    return await this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, role: string, orderId: number) {
    const where = role === 'owner' ? { id: orderId } : { id: orderId, userId };

    const order = await this.orderRepo.findOne({
      where,
      relations: {
        items: {
          selectedValues: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return order;
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    order.status = status;
    return await this.orderRepo.save(order);
  }

  async updatePaymentStatus(orderId: number, paymentStatus: PaymentStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    order.paymentStatus = paymentStatus;
    return await this.orderRepo.save(order);
  }

  async cancelOrder(userId: number, role: string, orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Order #${orderId} is already cancelled`);
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        `Cannot cancel Order #${orderId} because it has already been completed`,
      );
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepo.save(order);
  }
}
