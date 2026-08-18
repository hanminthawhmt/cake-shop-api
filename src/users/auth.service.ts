import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from './events/user-registered.event';
import { AuthProvider } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signup(name: string, email: string, password: string) {
    const userExists = await this.usersService.find(email);
    if (userExists) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.create(name, email, hashedPassword);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.email, user.name),
    );

    return {
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    };
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.find(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Log in successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: token,
    };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isOldPasswordCorrect = await compare(oldPassword, user.password);

    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Incorrect current password');
    }

    const hashedNewPassword = await hash(newPassword, 10);

    await this.usersService.updatePassword(user.id, {
      password: hashedNewPassword,
    });
    return { message: 'Password updated successfully' };
  }

  async googleLogin(googleUser: any) {
    let user = await this.usersService.find(googleUser.email);

    if (!user) {
      // Create new user for Google OAuth
      const newUser = await this.usersService.createGoogleUser(
        googleUser.name,
        googleUser.email,
        AuthProvider.GOOGLE,
      );

      if (!newUser) {
        throw new Error('Failed to create user');
      }

      user = newUser as any;

      this.eventEmitter.emit(
        'user.registered',
        new UserRegisteredEvent(user!.email, user!.name),
      );
    } else if (user.authProvider === AuthProvider.LOCAL) {
      // If user exists with local auth, update their auth provider
      await this.usersService.updateAuthProvider(user.id, AuthProvider.GOOGLE);
      user.authProvider = AuthProvider.GOOGLE;
    }

    if (!user) {
      throw new Error('User not found or created');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User signed in successfully via Google',
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    };
  }

  signout() {}
  reset() {}
}
