import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('order_item_selected_values')
export class OrderItemSelectedValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderItemId: number;

  @Column('int', { nullable: true })cl
  cakeOptionValueId: number | null;

  @Column()
  label: string;

  @Column('decimal', { precision: 10, scale: 2 })
  priceModifier: number;

  @ManyToOne(() => OrderItem, (item) => item.selectedValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;
}
