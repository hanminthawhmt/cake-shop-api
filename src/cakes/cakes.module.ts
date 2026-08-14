import { Module } from '@nestjs/common';
import { CakesController } from './cakes.controller';
import { CakesService } from './cakes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cake } from './entities/cake.entity';
import { CakeOption } from './entities/cake-option.entity';
import { CakeOptionValue } from './entities/cake-option-value.entity';
import { CakeImage } from './entities/cake-image.entity';
import { Category } from '../categories/entities/category.entity';
import { CakeOptionsService } from './cake-options.service';
import { CakeOptionsController } from './cake-options.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CakeImagesService } from './cake-images.service';
import { CakeImagesController } from './cake-images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cake,
      CakeOption,
      CakeOptionValue,
      CakeImage,
      Category,
    ]),
    CloudinaryModule,
  ],
  controllers: [CakesController, CakeOptionsController, CakeImagesController],
  providers: [CakesService, CakeOptionsService, CakeImagesService],
  exports: [CakesService],
})
export class CakesModule {}
