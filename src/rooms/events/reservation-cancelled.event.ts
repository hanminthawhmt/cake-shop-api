export class ReservationCancelledEvent {
  constructor(
    public readonly reservationId: number,
    public readonly customerEmail: string,
    public readonly customerName: string,
  ) {}
}