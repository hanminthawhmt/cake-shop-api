import { Controller, Get, Patch, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateInfoDto } from './dtos/update-info.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Fetches the authenticated user profile information.',
  })
  @ApiResponse({ status: 200, description: 'Current user data returned successfully.' })
  getUser(@CurrentUser() user: { userId: number }) {
    return this.usersService.getInfo(user.userId);
  }

  @Patch('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user',
    description: 'Updates the authenticated user contact details like address and phone.',
  })
  @ApiBody({ type: UpdateInfoDto, description: 'User profile fields to update.' })
  @ApiResponse({ status: 200, description: 'User info updated successfully.' })
  updateInfo(
    @CurrentUser() user: { userId: number },
    @Body() body: UpdateInfoDto,
  ) {
    return this.usersService.updateInfo(user.userId, body);
  }
}
