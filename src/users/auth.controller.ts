import { Post, Controller, Body, Patch, Get, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInUserDto } from './dtos/login-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorators';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

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

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Initiate Google OAuth',
    description: 'Redirects to Google login page.',
  })
  googleAuth() {
    // This endpoint is used to redirect to Google login
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handles the callback from Google after user authentication and redirects to frontend.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with JWT token in query parameter.',
  })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const { token } = await this.authService.googleLogin(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token}`;
    return res.redirect(redirectUrl);
  }
}
