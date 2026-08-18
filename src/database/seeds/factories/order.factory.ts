import { faker } from '@faker-js/faker';
import { OrderStatus, PaymentStatus } from '../../../orders/enums/order.enum';

export class OrderFactory {
  static createOrder(userId: number, overrides = {}) {
    const createdDate = faker.date.past({ years: 0.5 }); // Past 6 months
    const pickupDate = faker.date.soon({ days: 30, refDate: createdDate });

    const statuses = Object.values(OrderStatus);
    const paymentStatuses = Object.values(PaymentStatus);

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    // Completed orders are usually paid
    const paymentStatus =
      status === OrderStatus.COMPLETED
        ? PaymentStatus.PAID
        : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

    return {
      userId,
      status,
      paymentStatus,
      pickupDate: pickupDate.toISOString().split('T')[0],
      pickupTime: ['10:00', '12:00', '14:00', '16:00'][
        Math.floor(Math.random() * 4)
      ],
      totalPrice: parseFloat(
        (faker.number.float({ min: 50, max: 300 })).toFixed(2)
      ),
      createdAt: createdDate,
      updatedAt: faker.date.between({
        from: createdDate,
        to: new Date(),
      }),
      ...overrides,
    };
  }

  static createOrders(userIds: number[], count: number) {
    return Array.from({ length: count }, () => {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      return this.createOrder(userId);
    });
  }
}
