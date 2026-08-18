import { faker } from '@faker-js/faker';

export class RoomFactory {
  static roomNames = [
    'Elegant Ballroom',
    'Sunset Garden Hall',
    'Crystal Grand Hall',
    'Golden Palace Room',
    'Royal Blue Lounge',
    'Garden Terrace',
    'Moonlight Hall',
    'Diamond Suite',
    'Emerald Room',
    'Silver Celebration',
  ];

  static createRoom(overrides = {}) {
    const name = this.roomNames[Math.floor(Math.random() * this.roomNames.length)];
    const capacity = faker.number.int({ min: 20, max: 200 });
    
    return {
      name: `${name} - ${capacity} guests`,
      description: faker.lorem.sentences(3),
      capacity,
      price: parseFloat(
        (faker.number.float({ min: 500, max: 5000 })).toFixed(2)
      ),
      isAvailable: faker.datatype.boolean({ probability: 0.95 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    };
  }

  static createRooms(count: number) {
    return Array.from({ length: count }, () => this.createRoom());
  }
}
