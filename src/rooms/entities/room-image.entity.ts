import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('room_images')
export class RoomImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ default: 0 })
  displayOrder: number;
}
