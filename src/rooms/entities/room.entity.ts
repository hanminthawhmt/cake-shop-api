import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomReservation } from './room-reservation.entity';
import { RoomImage } from './room-image.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('int')
  capacity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => RoomReservation, (reservation) => reservation.room)
  reservations: RoomReservation[];

  @OneToMany(() => RoomImage, (image) => image.room)
  images: RoomImage[];
}
