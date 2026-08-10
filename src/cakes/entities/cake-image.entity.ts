import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cake } from './cake.entity';

@Entity('cake_images')
export class CakeImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cakeId: number;

  @ManyToOne(() => Cake, (cake) => cake.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cakeId' })
  cake: Cake;

  @Column()
  url: string;

  @Column({ default: 0 })
  displayOrder: number;
}
