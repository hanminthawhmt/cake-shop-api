import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderItemSelectedValue } from './order-item-selected-value.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column('int', { nullable: true })
  cakeId: number | null;

  @Column()
  cakeName: string; // Snapshot of cake name at the time of purchase

  @Column('int')
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number; // Base cake price snapshot

  @Column('decimal', { precision: 10, scale: 2 })
  lineTotal: number; // (unitPrice + modifiers) * quantity

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @OneToMany(() => OrderItemSelectedValue, (sv) => sv.orderItem)
  selectedValues: OrderItemSelectedValue[];
}
