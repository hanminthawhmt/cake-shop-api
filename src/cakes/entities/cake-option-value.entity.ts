import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CakeOption } from './cake-option.entity';
import { CartItemSelectedValue } from '../../cart/entities/cart-item-selected-value.entity';

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

  @OneToMany(
    () => CartItemSelectedValue,
    (selectedValue) => selectedValue.cartItem,
  )
  itemSelectedValue: CartItemSelectedValue[];
}
