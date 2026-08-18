import { faker } from '@faker-js/faker';

export class CakeFactory {
  static cakeNames = [
    'Classic Chocolate Delight',
    'Vanilla Dream',
    'Strawberry Bliss',
    'Lemon Paradise',
    'Red Velvet Romance',
    'Black Forest Magic',
    'Carrot Dream Cake',
    'Cheesecake Supreme',
    'Tiramisu Heaven',
    'Funfetti Celebration',
    'Raspberry Mousse',
    'Cookies & Cream',
    'Pistachio Elegance',
    'Espresso Lover',
    'Tropical Mango',
  ];

  static createCake(categoryId: number, overrides = {}) {
    const name = this.cakeNames[Math.floor(Math.random() * this.cakeNames.length)];
    return {
      name: `${name} - ${faker.lorem.word()}`,
      description: faker.lorem.sentences(2),
      basePrice: parseFloat((faker.number.float({ min: 20, max: 80 })).toFixed(2)),
      isAvailable: faker.datatype.boolean({ probability: 0.9 }),
      categoryId,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
    };
  }

  static createCakes(categoryIds: number[], count: number) {
    return Array.from({ length: count }, () => {
      const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      return this.createCake(categoryId);
    });
  }
}
