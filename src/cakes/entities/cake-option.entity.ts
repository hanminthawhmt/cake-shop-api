import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cake } from './cake.entity';
import { CakeOptionValue } from './cake-option-value.entity';

@Entity('cake_options')
export class CakeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cakeId: number;

  @ManyToOne(() => Cake, (cake) => cake.options)
  @JoinColumn({ name: 'cakeId' })
  cake: Cake;

  @Column()
  name: string;

  @OneToMany(() => CakeOptionValue, (value) => value.option)
  values: CakeOptionValue[];
}
