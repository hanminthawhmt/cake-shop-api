import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemSelectedValue } from './entities/order-item-selected-value.entity';
import { CartService } from '../cart/cart.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus, PaymentStatus } from './enums/order.enum';
import { CartItem } from '../cart/entities/cart-item.entity';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderStatusUpdatedEvent } from './events/order-status-updated.event';
import { OrderCancelledEvent } from './events/order-cancelled.event';
import { FindOrdersDto } from './dtos/find-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private cartService: CartService,
    @InjectDataSource() private datasource: DataSource,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
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

    const customer = await this.usersService.findOne(userId);

    const savedOrder = await this.datasource.transaction(async (manager) => {
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

    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(
        savedOrder.id,
        customer!.email,
        customer!.name,
        savedOrder.pickupDate as unknown as string,
        savedOrder.pickupTime,
        savedOrder.totalPrice,
        cart!.items.map((i) => ({
          cakeName: i.cake.name,
          quantity: i.quantity,
        })),
      ),
    );
    return savedOrder;
  }

  async findOrders(userId: number, role: string, filters: FindOrdersDto) {
    const where: FindOptionsWhere<Order> = role === 'owner' ? {} : { userId };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.date) {
      where.pickupDate = new Date(filters.date);
    }

    return this.orderRepo.find({
      where,
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
    const savedOrder = await this.orderRepo.save(order);
    const customer = await this.usersService.findOne(order.userId);
    this.eventEmitter.emit(
      'order.status_updated',
      new OrderStatusUpdatedEvent(
        savedOrder.id,
        customer!.email,
        customer!.name,
        savedOrder.status,
      ),
    );
    return savedOrder;
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
    const order = await this.orderRepo.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (role !== 'owner') {
      if (order.userId !== userId) {
        throw new ForbiddenException('You can only cancel your own orders.');
      }

      const pickupDateTime = new Date(
        `${order.pickupDate}T${order.pickupTime}`,
      );
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() + 2);

      if (pickupDateTime.getTime() < cutoff.getTime()) {
        throw new BadRequestException(
          'Orders can only be cancelled at least 2 hours before pickup.',
        );
      }
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
    const cancelledOrder = await this.orderRepo.save(order);
    const customer = await this.usersService.findOne(order.userId);
    this.eventEmitter.emit(
      'order.cancelled',
      new OrderCancelledEvent(
        cancelledOrder.id,
        customer!.email,
        customer!.name,
      ),
    );
    return cancelledOrder;
  }

  async generateBakingSlip(orderId: number): Promise<string> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: { selectedValues: true } },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const customer = await this.usersService.findOne(order.userId);

    const itemsHtml = order.items
      .map((item) => {
        const optionsHtml = item.selectedValues
          .map((sv) => `<div>${sv.label}</div>`)
          .join('');
        return `
        <div class="item">
          <div class="item-name">${item.cakeName} × ${item.quantity}</div>
          ${optionsHtml}
          ${item.notes ? `<div class="notes">Notes: ${item.notes}</div>` : ''}
        </div>
      `;
      })
      .join('<hr/>');
    return `
    <html>
      <head>
        <style>
          body { font-family: monospace; width: 320px; margin: 0 auto; }
          .center { text-align: center; }
          hr { border-top: 1px dashed #000; }
        </style>
      </head>
      <body>
        <div class="center">
          <h2>CAKE SHOP</h2>
          <h3>BAKING SLIP</h3>
        </div>
        <hr/>
        <div>Order #: ${order.id}</div>
        <div>Pickup: ${order.pickupDate} ${order.pickupTime}</div>
        <div>Customer: ${customer?.name ?? 'Unknown'}</div>
        <hr/>
        ${itemsHtml}
        <hr/>
        <div>Payment: ${order.paymentStatus.toUpperCase()}</div>
      </body>
    </html>
  `;
  }
}
