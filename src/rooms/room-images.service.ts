import { InjectRepository } from '@nestjs/typeorm';
import { RoomImage } from './entities/room-image.entity';
import { Repository } from 'typeorm';
import { RoomsService } from './rooms.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoomImagesService {
  constructor(
    @InjectRepository(RoomImage) private imageRepo: Repository<RoomImage>,
    private roomsService: RoomsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private async verifyImageBelongsToRoom(roomId: number, imageId: number) {
    const image = await this.imageRepo.findOne({
      where: {
        id: imageId,
        roomId,
      },
    });

    if (!image) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for room ${roomId}.`,
      );
    }
    return image;
  }

  async uploadRoomImage(roomId: number, file: Express.Multer.File) {
    await this.roomsService.findOne(roomId);
    const { url, publicId } = await this.cloudinaryService.uploadImage(
      file,
      'rooms',
    );
    const image = this.imageRepo.create({ roomId, url, publicId });
    return this.imageRepo.save(image);
  }

  async removeRoomImage(roomId: number, imageId: number) {
    const image = await this.verifyImageBelongsToRoom(roomId, imageId);
    await this.cloudinaryService.deleteImage(image.publicId);
    return this.imageRepo.remove(image);
  }
}
