import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CakeOption } from './cake-option.entity';

@Entity('cake_option_values')
export class CakeOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cakeOptionId: number;

  @ManyToOne(() => CakeOption, (option) => option.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cakeOptionId' })
  option: CakeOption;

  @Column()
  label: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  priceModifier: number;
}
