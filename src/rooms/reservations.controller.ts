import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { UpdateReservationStatusDto } from './dtos/update-reservation.dto';

@Controller()
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post('/rooms/:roomId/reservations')
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
  findReservations(@CurrentUser() user: { userId: number; role: string }) {
    return this.reservationsService.findReservations(user.userId, user.role);
  }

  @Get('/reservations/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    return this.reservationsService.findOne(id, user.userId, user.role);
  }

  @Roles('owner')
  @Patch('/reservations/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, body.status);
  }

  @Patch('/reservations/:id/cancel')
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
