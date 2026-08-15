import { Injectable, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomReservation } from './entities/room-reservation.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { ReservationStatus, TimeSlot } from './enums/room.enum';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(RoomReservation)
    private reservationRepo: Repository<RoomReservation>,
  ) {}

  create(dto: CreateRoomDto) {
    const room = this.roomRepo.create(dto);
    return this.roomRepo.save(room);
  }

  findAll() {
    return this.roomRepo.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: { images: true },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found.`);
    }
    return room;
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
    this.roomRepo.merge(room, dto);
    return this.roomRepo.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    return this.roomRepo.remove(room);
  }

  async getAvailability(roomId: number, date: string) {
    await this.findOne(roomId);
    const reservations = await this.reservationRepo.find({
      where: { roomId, date, status: Not(ReservationStatus.CANCELLED) },
    });
    const bookedSlots = reservations.map((r) => r.timeSlot);
    return Object.values(TimeSlot).map((slot) => ({
      timeSlot: slot,
      isAvailable: !bookedSlots.includes(slot),
    }));
  }
    
}
