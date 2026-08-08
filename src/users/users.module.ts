import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {}
