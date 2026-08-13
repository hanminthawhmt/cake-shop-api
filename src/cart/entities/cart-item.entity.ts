import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Cake } from '../../cakes/entities/cake.entity';
import { CartItemSelectedValue } from './cart-item-selected-value.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cartId: number;

  @Column()
  cakeId: number;

  @Column()
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Cake)
  @JoinColumn({ name: 'cakeId' })
  cake: Cake;

  @OneToMany(
    () => CartItemSelectedValue,
    (selectedValue) => selectedValue.cartItem,
  )
  itemSelectedValue: CartItemSelectedValue[];
}
