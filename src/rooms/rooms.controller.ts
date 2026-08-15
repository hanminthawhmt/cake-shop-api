import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomsService } from './rooms.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Public } from '../users/decorators/public.decorators';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Public()
  @Get()
  listRooms() {
    return this.roomsService.findAll();
  }

  @Public()
  @Get('/:id')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Public()
  @Get('/:id/availability')
  getAvailability(
    @Param('id', ParseIntPipe) roomId: number,
    @Query('date') date: string,
  ) {
    return this.roomsService.getAvailability(roomId, date);
  }

  @Roles('owner')
  @Post()
  createRoom(@Body() body: CreateRoomDto) {
    return this.roomsService.create(body);
  }

  @Roles('owner')
  @Patch('/:id')
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, body);
  }

  @Roles('owner')
  @Delete('/:id')
  deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
