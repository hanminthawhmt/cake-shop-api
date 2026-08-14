import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: { userId: number }) {
    return this.cartService.getCart(user.userId);
  }

  @Post('/items')
  addItems(
    @CurrentUser() user: { userId: number },
    @Body() body: AddCartItemDto,
  ) {
    return this.cartService.addItemToCart(user.userId, body);
  }

  @Patch('/items/:id')
  updateItemCart(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemCart(user.userId, id, body);
  }

  @Delete('/items/:id')
  deleteCartItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
  ) {
    return this.cartService.removeCartItem(user.userId, id);
  }

  @Delete()
  removeCart(@CurrentUser() user: { userId: number }) {
    return this.cartService.clearCart(user.userId);
  }
}
