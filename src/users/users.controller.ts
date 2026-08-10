import { Controller, Get, Patch, Body } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateInfoDto } from './dtos/update-info.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  
  @Get('/me')
  getUser(@CurrentUser() user: { userId: number }) {
    return this.usersService.getInfo(user.userId);
  }

 
  @Patch('/me')
  updateInfo(
    @CurrentUser() user: { userId: number },
    @Body() body: UpdateInfoDto,
  ) {
    return this.usersService.updateInfo(user.userId, body);
  }
}
