export class OrderCancelledEvent {
  constructor(
    public readonly orderId: number,
    public readonly customerEmail: string,
    public readonly customerName: string,
  ) {}
}
