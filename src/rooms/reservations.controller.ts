import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { UpdateReservationStatusDto } from './dtos/update-reservation.dto';

@ApiTags('Reservations')
@Controller()
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post('/rooms/:roomId/reservations')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create reservation',
    description: 'Creates a reservation for a room on a selected date and time slot.',
  })
  @ApiParam({ name: 'roomId', type: Number, description: 'Room identifier', example: 1 })
  @ApiBody({ type: CreateReservationDto, description: 'Reservation request payload.' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully.' })
  createReservation(
    @Param('roomId', ParseIntPipe) roomId: number,
    @CurrentUser() user: { userId: number },
    @Body() body: CreateReservationDto,
  ) {
    return this.reservationsService.createReservation(
      user.userId,
      roomId,
      body,
    );
  }

  @Get('/reservations')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List reservations',
    description: 'Returns reservations visible to the current user depending on their role.',
  })
  @ApiResponse({ status: 200, description: 'Reservations retrieved successfully.' })
  findReservations(@CurrentUser() user: { userId: number; role: string }) {
    return this.reservationsService.findReservations(user.userId, user.role);
  }

  @Get('/reservations/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get reservation by ID',
    description: 'Returns details for a single reservation if the user is allowed to view it.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Reservation identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Reservation found successfully.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.reservationsService.findOne(id, user.userId, user.role);
  }

  @Roles('owner')
  @Patch('/reservations/:id/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update reservation status',
    description: 'Updates a reservation status. Restricted to owners.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Reservation identifier', example: 1 })
  @ApiBody({ type: UpdateReservationStatusDto, description: 'New reservation status.' })
  @ApiResponse({ status: 200, description: 'Reservation status updated.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, body.status);
  }

  @Patch('/reservations/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel reservation',
    description: 'Cancels an existing reservation by the requester or owner.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Reservation identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Reservation canceled successfully.' })
  cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.reservationsService.cancelReservation(
      id,
      user.userId,
      user.role,
    );
  }
}
