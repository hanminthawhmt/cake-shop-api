export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly customerEmail: string,
    public readonly customerName: string,
    public readonly pickupDate: string,
    public readonly pickupTime: string,
    public readonly totalPrice: number,
    public readonly items: { cakeName: string; quantity: number }[],
  ) {}
}
