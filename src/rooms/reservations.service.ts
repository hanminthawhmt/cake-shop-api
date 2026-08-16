import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomReservation } from './entities/room-reservation.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { RoomsService } from './rooms.service';
import { ReservationStatus } from './enums/room.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReservationCreatedEvent } from './events/reservation-created.event';
import { UsersService } from '../users/users.service';
import { ReservationCancelledEvent } from './events/reservation-cancelled.event';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(RoomReservation)
    private reservationsRepo: Repository<RoomReservation>,
    private usersService: UsersService,
    private roomsService: RoomsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createReservation(
    userId: number,
    roomId: number,
    dto: CreateReservationDto,
  ) {
    const room = await this.roomsService.findOne(roomId);

    if (dto.guestCount > room.capacity) {
      throw new BadRequestException(
        `This room only accommodates up to ${room.capacity} guests.`,
      );
    }

    const slotDateTime = new Date(`${dto.date}T${dto.timeSlot}:00`);

    if (slotDateTime.getTime() < Date.now()) {
      throw new BadRequestException(
        'Cannot book a time slot that has already passed.',
      );
    }

    const reservation = this.reservationsRepo.create({
      roomId,
      userId,
      date: dto.date,
      timeSlot: dto.timeSlot,
      guestCount: dto.guestCount,
      birthdayRequirements: dto.birthdayRequirements,
      status: ReservationStatus.PENDING,
    });

    try {
      const savedReservation = await this.reservationsRepo.save(reservation);
      const customer = await this.usersService.findOne(userId);
      this.eventEmitter.emit(
        'reservation.created',
        new ReservationCreatedEvent(
          savedReservation.id,
          customer!.email,
          customer!.name,
          room.name,
          dto.date,
          dto.timeSlot,
        ),
      );
      return savedReservation;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException(
          'This time slot has just been booked by someone else. Please choose another.',
        );
      }
      throw error;
    }
  }

  async findReservations(userId: number, role: string) {
    if (role === 'owner') {
      return await this.reservationsRepo.find({
        order: { createdAt: 'desc' },
      });
    }
    return await this.reservationsRepo.find({
      where: { userId: userId },
      order: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const where = role === 'owner' ? { id } : { id, userId };
    const reservation = await this.reservationsRepo.findOneBy(where);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }
    return reservation;
  }

  async updateStatus(id: number, status: ReservationStatus) {
    const reservation = await this.reservationsRepo.findOne({
      where: { id: id },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    reservation.status = status;
    return await this.reservationsRepo.save(reservation);
  }

  async cancelReservation(reservationId: number, userId: number, role: string) {
    const reservation = await this.reservationsRepo.findOne({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with id ${reservationId} not found`,
      );
    }

    if (role !== 'owner' && reservation.userId !== userId) {
      throw new ForbiddenException(
        'You can only cancel your own reservations.',
      );
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException(
        `Reservation #${reservationId} is already cancelled`,
      );
    }

    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new BadRequestException(
        `Cannot cancel Reservation #${reservationId} because it has already been completed`,
      );
    }

    reservation.status = ReservationStatus.CANCELLED;
    const savedReservation = await this.reservationsRepo.save(reservation);

    const customer = await this.usersService.findOne(reservation.userId);
    this.eventEmitter.emit(
      'reservation.cancelled',
      new ReservationCancelledEvent(
        savedReservation.id,
        customer!.email,
        customer!.name,
      ),
    );

    return savedReservation;
  }
}
