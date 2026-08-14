import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { CakesService } from '../cakes/cakes.service';
import { CartItemSelectedValue } from './entities/cart-item-selected-value.entity';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(CartItemSelectedValue)
    private selectedValueRepo: Repository<CartItemSelectedValue>,
    private cakesService: CakesService,
  ) {}

  private async verifyItemBelongsToCart(cartId: number, itemId: number) {
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cartId },
      relations: { itemSelectedValue: true },
    });
    if (!item) {
      throw new NotFoundException(
        `Cart item with ID ${itemId} not found in this cart.`,
      );
    }
    return item;
  }

  private async getOrCreateCart(userId: number) {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (cart) {
      return cart;
    }
    const newCart = this.cartRepo.create({ userId });
    return this.cartRepo.save(newCart);
  }

  async addItemToCart(userId: number, dto: AddCartItemDto) {
    const cake = await this.cakesService.findOne(dto.cakeId);
    if (!cake.isAvailable) {
      throw new BadRequestException(
        `Cake "${cake.name}" is not currently available.`,
      );
    }

    const validValueIds = cake.options.flatMap((o) =>
      o.values.map((v) => v.id),
    );
    const allValid = dto.selectedValueIds.every((id) =>
      validValueIds.includes(id),
    );
    if (!allValid) {
      throw new BadRequestException(
        'One or more selected options do not belong to this cake.',
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItems = await this.cartItemRepo.find({
      where: { cartId: cart.id, cakeId: dto.cakeId },
      relations: { itemSelectedValue: true },
    });

    const incomingSorted = [...dto.selectedValueIds].sort().join(',');
    const matchingItem = existingItems.find((item) => {
      const existingSorted = item.itemSelectedValue
        .map((sv) => sv.cakeOptionValueId)
        .sort()
        .join(',');
      return existingSorted === incomingSorted;
    });

    if (matchingItem) {
      matchingItem.quantity += dto.quantity;
      return this.cartItemRepo.save(matchingItem);
    }

    const cartItem = this.cartItemRepo.create({
      cartId: cart.id,
      cakeId: dto.cakeId,
      quantity: dto.quantity,
      notes: dto.notes,
    });

    const savedItem = await this.cartItemRepo.save(cartItem);

    const selectedValues = dto.selectedValueIds.map((valueId) =>
      this.selectedValueRepo.create({
        cartItemId: savedItem.id,
        cakeOptionValueId: valueId,
      }),
    );
    await this.selectedValueRepo.save(selectedValues);

    return savedItem;
  }

  async updateItemCart(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.verifyItemBelongsToCart(cart.id, itemId);

    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }

    if (dto.notes !== undefined) {
      item.notes = dto.notes;
    }

    return this.cartItemRepo.save(item);
  }

  async removeCartItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.verifyItemBelongsToCart(cart.id, itemId);
    return this.cartItemRepo.remove(item);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.cartItemRepo.delete({ cartId: cart.id });
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    const items = await this.cartItemRepo.find({
      where: { cartId: cart.id },
      relations: { cake: true, itemSelectedValue: { value: true } },
    });

    const itemsWithPricing = items.map((item) => this.computeItemPricing(item));
    const cartTotal = itemsWithPricing.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );

    return { cartId: cart.id, items: itemsWithPricing, cartTotal };
  }

  private computeItemPricing(item: CartItem) {
    const optionsTotal = item.itemSelectedValue.reduce(
      (sum, sv) => sum + Number(sv.value.priceModifier),
      0,
    );
    const unitPrice = Number(item.cake.basePrice) + optionsTotal;
    const lineTotal = unitPrice * item.quantity;

    return {
      id: item.id,
      cake: { id: item.cake.id, name: item.cake.name },
      quantity: item.quantity,
      notes: item.notes,
      selectedValues: item.itemSelectedValue.map((sv) => ({
        id: sv.value.id,
        label: sv.value.label,
        priceModifier: sv.value.priceModifier,
      })),
      unitPrice,
      lineTotal,
    };
  }
}
