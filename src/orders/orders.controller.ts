import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Header,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dtos/update-payment-status.dto';
import { FindOrdersDto } from './dtos/find-orders.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Check out the current cart into a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid pickup date or empty cart',
  })
  @Post()
  createOrder(
    @CurrentUser() user: { userId: number },
    @Body() body: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.userId, body);
  }

  @ApiOperation({
    summary:
      'List orders — customers see their own, owners see all, with optional filters',
  })
  @Get()
  getOrderList(
    @CurrentUser() user: { userId: number; role: string },
    @Query() query: FindOrdersDto,
  ) {
    return this.ordersService.findOrders(user.userId, user.role, query);
  }

  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get('/:id')
  getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.ordersService.findOne(user.userId, user.role, id);
  }

  @ApiOperation({ summary: 'Update order status (owner only)' })
  @ApiParam({ name: 'id', type: Number })
  @Patch('/:id/status')
  @Roles('owner')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @ApiOperation({ summary: 'Mark payment as received (owner only)' })
  @ApiParam({ name: 'id', type: Number })
  @Patch('/:id/payment')
  @Roles('owner')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus);
  }

  @ApiOperation({
    summary:
      'Cancel an order — customer (own orders, 2hr cutoff) or owner (any order)',
  })
  @ApiParam({ name: 'id', type: Number })
  @Patch('/:id/cancel')
  @Roles('owner')
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.ordersService.cancelOrder(user.userId, user.role, id);
  }

  @ApiOperation({
    summary: 'Generate a printable baking slip for this order (owner only)',
  })
  @ApiParam({ name: 'id', type: Number })
  @Get('/:id/baking-slip')
  @Roles('owner')
  @Header('Content-Type', 'text/html')
  getBakingSlip(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.generateBakingSlip(id);
  }
}
