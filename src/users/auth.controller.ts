import { Post, Controller, Body, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInUserDto } from './dtos/login-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
    description: 'Creates a new user account using a name, email, and password.',
  })
  @ApiBody({ type: CreateUserDto, description: 'Registration payload.' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.name, body.email, body.password);
  }

  @Public()
  @Post('signin')
  @ApiOperation({
    summary: 'Sign in',
    description: 'Authenticates a user and returns a JWT token.',
  })
  @ApiBody({ type: LogInUserDto, description: 'Login credentials.' })
  @ApiResponse({ status: 200, description: 'User signed in successfully.' })
  signin(@Body() body: LogInUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: 'Changes the authenticated user password after verifying the old one.',
  })
  @ApiBody({ type: ChangePasswordDto, description: 'Old and new password payload.' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
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
