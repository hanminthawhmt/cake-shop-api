import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Room } from './room.entity';
import { TimeSlot, ReservationStatus } from '../enums/room.enum';

@Entity('room_reservations')
@Unique(['roomId', 'date', 'timeSlot'])
export class RoomReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: TimeSlot })
  timeSlot: TimeSlot;

  @Column('int')
  guestCount: number;

  @Column({ type: 'text', nullable: true })
  birthdayRequirements: string | null;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;
}
