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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomsService } from './rooms.service';
import { Roles } from '../users/decorators/roles.decorator';
import { Public } from '../users/decorators/public.decorators';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List rooms', description: 'Returns all rooms in the property.' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully.' })
  listRooms() {
    return this.roomsService.findAll();
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Get room by ID', description: 'Returns details for a specific room.' })
  @ApiParam({ name: 'id', type: Number, description: 'Room identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Room found successfully.' })
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Public()
  @Get('/:id/availability')
  @ApiOperation({
    summary: 'Check room availability',
    description: 'Returns availability information for a room on a given date.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Room identifier', example: 1 })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    description: 'Date in ISO format (YYYY-MM-DD)',
    example: '2026-08-20',
  })
  @ApiResponse({ status: 200, description: 'Availability returned successfully.' })
  getAvailability(
    @Param('id', ParseIntPipe) roomId: number,
    @Query('date') date: string,
  ) {
    return this.roomsService.getAvailability(roomId, date);
  }

  @Roles('owner')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create room',
    description: 'Creates a new room. Restricted to owners.',
  })
  @ApiBody({ type: CreateRoomDto, description: 'Room data to create.' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  createRoom(@Body() body: CreateRoomDto) {
    return this.roomsService.create(body);
  }

  @Roles('owner')
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update room',
    description: 'Updates details for a specific room.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Room identifier', example: 1 })
  @ApiBody({ type: UpdateRoomDto, description: 'Room fields to update.' })
  @ApiResponse({ status: 200, description: 'Room updated successfully.' })
  updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, body);
  }

  @Roles('owner')
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete room', description: 'Deletes a room.' })
  @ApiParam({ name: 'id', type: Number, description: 'Room identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
