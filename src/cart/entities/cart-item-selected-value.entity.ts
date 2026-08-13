import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CakeOptionValue } from '../../cakes/entities/cake-option-value.entity';

@Entity('cart_item_selected_values')
export class CartItemSelectedValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cartItemId: number;

  @Column()
  cakeOptionValueId: number;

  @ManyToOne(() => CartItem, (item) => item.itemSelectedValue)
  @JoinColumn({ name: 'cartItemId' })
  cartItem: CartItem;

  @ManyToOne(
    () => CakeOptionValue,
    (optionValue) => optionValue.itemSelectedValue,
  )
  @JoinColumn({ name: 'cakeOptionValueId' })
  value: CakeOptionValue;
}
