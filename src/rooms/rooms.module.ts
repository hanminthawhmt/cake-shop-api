import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Room } from './entities/room.entity';
import { RoomReservation } from './entities/room-reservation.entity';
import { RoomImage } from './entities/room-image.entity';
import { RoomImagesService } from './room-images.service';
import { RoomImagesController } from './room-images.controller';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomReservation, RoomImage]),
    CloudinaryModule,
  ],
  providers: [RoomsService, RoomImagesService, ReservationsService],
  controllers: [RoomsController, RoomImagesController, ReservationsController],
})
export class RoomsModule {}
