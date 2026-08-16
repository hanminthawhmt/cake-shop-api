export class ReservationCreatedEvent {
  constructor(
    public readonly reservationId: number,
    public readonly customerEmail: string,
    public readonly customerName: string,
    public readonly roomName: string,
    public readonly date: string,
    public readonly timeSlot: string,
  ) {}
}
