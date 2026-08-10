import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { CakeImage } from './cake-image.entity';
import { CakeOption } from './cake-option.entity';

@Entity('cakes')
export class Cake {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.cakes)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => CakeImage, (image) => image.cake)
  images: CakeImage[];

  @OneToMany(() => CakeOption, (option) => option.cake)
  options: CakeOption[];
}
