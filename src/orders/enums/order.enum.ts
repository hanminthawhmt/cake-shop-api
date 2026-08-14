export enum OrderStatus {
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICK_UP = 'ready_for_pick_up',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
}
