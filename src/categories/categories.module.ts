import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Cake } from '../cakes/entities/cake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Cake])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
