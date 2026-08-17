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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cart', description: 'Returns the current user cart.' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  getCart(@CurrentUser() user: { userId: number }) {
    return this.cartService.getCart(user.userId);
  }

  @Post('/items')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Adds a cake item to the authenticated user cart.',
  })
  @ApiBody({ type: AddCartItemDto, description: 'Cart item payload.' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  addItems(
    @CurrentUser() user: { userId: number },
    @Body() body: AddCartItemDto,
  ) {
    return this.cartService.addItemToCart(user.userId, body);
  }

  @Patch('/items/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update cart item',
    description: 'Updates quantity or notes for a cart item.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cart item identifier', example: 1 })
  @ApiBody({ type: UpdateCartItemDto, description: 'Fields to update.' })
  @ApiResponse({ status: 200, description: 'Cart item updated.' })
  updateItemCart(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemCart(user.userId, id, body);
  }

  @Delete('/items/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove cart item', description: 'Deletes a specific item from the cart.' })
  @ApiParam({ name: 'id', type: Number, description: 'Cart item identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Cart item removed.' })
  deleteCartItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number },
  ) {
    return this.cartService.removeCartItem(user.userId, id);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear cart', description: 'Removes all items from the current cart.' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  removeCart(@CurrentUser() user: { userId: number }) {
    return this.cartService.clearCart(user.userId);
  }
}
