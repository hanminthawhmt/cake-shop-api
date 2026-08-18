import { faker } from '@faker-js/faker';
import { ReservationStatus, TimeSlot } from '../../../rooms/enums/room.enum';

export class ReservationFactory {
  static timeSlots = [
    TimeSlot.SLOT_10_00,
    TimeSlot.SLOT_12_00,
    TimeSlot.SLOT_14_00,
  ];

  static createReservation(roomId: number, userId: number, overrides = {}) {
    const createdDate = faker.date.past({ years: 0.5 }); // Past 6 months
    const reservationDate = faker.date.soon({ days: 60, refDate: createdDate });

    const statuses = Object.values(ReservationStatus);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      roomId,
      userId,
      date: reservationDate.toISOString().split('T')[0],
      timeSlot: this.timeSlots[Math.floor(Math.random() * this.timeSlots.length)],
      guestCount: faker.number.int({ min: 20, max: 150 }),
      birthdayRequirements: faker.datatype.boolean({ probability: 0.5 })
        ? faker.lorem.sentence()
        : null,
      status,
      createdAt: createdDate,
      ...overrides,
    };
  }

  static createReservations(
    roomIds: number[],
    userIds: number[],
    count: number,
  ) {
    return Array.from({ length: count }, () => {
      const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      return this.createReservation(roomId, userId);
    });
  }
}
