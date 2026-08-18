import { faker } from '@faker-js/faker';

export class CategoryFactory {
  static cakeCategories = [
    'Chocolate',
    'Vanilla',
    'Cheesecake',
    'Red Velvet',
    'Carrot Cake',
    'Lemon',
    'Strawberry',
    'Black Forest',
    'Tiramisu',
    'Funfetti',
  ];

  static createCategory(overrides = {}) {
    const name = this.cakeCategories[
      Math.floor(Math.random() * this.cakeCategories.length)
    ];
    return {
      name,
      ...overrides,
    };
  }

  static createCategories() {
    return this.cakeCategories.map((name) => ({ name }));
  }
}
