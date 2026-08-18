import { faker } from '@faker-js/faker';
import { Role, AuthProvider } from '../../../users/entities/user.entity';

export class UserFactory {
  static createCustomer(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'hashed_password_here', // Will be replaced by actual hashed password
      role: Role.CUSTOMER,
      authProvider: AuthProvider.LOCAL,
      ...overrides,
    };
  }

  static createCustomers(count: number) {
    return Array.from({ length: count }, () => this.createCustomer());
  }
}
