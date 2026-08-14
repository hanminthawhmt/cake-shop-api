import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartItemSelectedValue } from './entities/cart-item-selected-value.entity';
import { CakesModule } from '../cakes/cakes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, CartItemSelectedValue]),
    CakesModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
