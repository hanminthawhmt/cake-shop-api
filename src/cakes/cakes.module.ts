import { Module } from '@nestjs/common';
import { CakesController } from './cakes.controller';
import { CakesService } from './cakes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cake } from './entities/cake.entity';
import { CakeOption } from './entities/cake-option.entity';
import { CakeOptionValue } from './entities/cake-option-value.entity';
import { CakeImage } from './entities/cake-image.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cake,
      CakeOption,
      CakeOptionValue,
      CakeImage,
      Category,
    ]),
  ],
  controllers: [CakesController],
  providers: [CakesService],
})
export class CakesModule {}
