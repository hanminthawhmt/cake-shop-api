import { OrderStatus } from '../enums/order.enum';

export class OrderStatusUpdatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly customerEmail: string,
    public readonly customerName: string,
    public readonly newStatus: OrderStatus,
  ) {}
}
