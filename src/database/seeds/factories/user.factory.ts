import { faker } from '@faker-js/faker';
import { Role, AuthProvider } from '../../../users/entities/user.entity';

export class UserFactory {
  static createOwner(overrides = {}) {
    return {
      name: 'Cake Shop Owner',
      email: 'owner@cakeshop.com',
      password: 'hashed_password_here', // Will be replaced by actual hashed password
      role: Role.OWNER,
      authProvider: AuthProvider.LOCAL,
      ...overrides,
    };
  }

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
