import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Res,
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

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(
    @CurrentUser() user: { userId: number },
    @Body() body: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.userId, body);
  }

  @Get()
  getOrderList(
  @CurrentUser() user: { userId: number; role: string },
  @Query() query: FindOrdersDto,
) {
  return this.ordersService.findOrders(user.userId, user.role, query);
}

  @Get('/:id')
  getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.ordersService.findOne(user.userId, user.role, id);
  }

  @Patch('/:id/status')
  @Roles('owner')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Patch('/:id/payment')
  @Roles('owner')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus);
  }

  @Patch('/:id/cancel')
  @Roles('owner')
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.ordersService.cancelOrder(user.userId, user.role, id);
  }

  @Get('/:id/baking-slip')
  @Roles('owner')
  @Header('Content-Type', 'text/html')
  getBakingSlip(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.generateBakingSlip(id);
  }
}
