import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cake } from '../../cakes/entities/cake.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Cake, (cake) => cake.category)
  cakes: Cake[];
}
