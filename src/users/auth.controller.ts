import { Post, Controller, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInUserDto } from './dtos/login-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.name, body.email, body.password);
  }

  @Post('signin')
  signin(@Body() body: LogInUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  changePassword(
    @CurrentUser() user: { userId: number },
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.userId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
