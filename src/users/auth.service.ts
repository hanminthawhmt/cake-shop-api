import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string) {
    const userExists = await this.usersService.find(email);
    if (userExists) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.create(name, email, hashedPassword);

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
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

    const payload = { userId: user.id, email: user.email };
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

  signout() {}
  reset() {}
}
