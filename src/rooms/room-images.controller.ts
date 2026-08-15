import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../users/decorators/roles.decorator';
import { RoomImagesService } from './room-images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rooms/:roomId/images')
export class RoomImagesController {
  constructor(private imagesService: RoomImagesService) {}

  @Roles('owner')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  uploadRoomImage(
    @Param('roomId', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.uploadRoomImage(id, file);
  }

  @Roles('owner')
  @Delete('/:imageId')
  removeRoomImage(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.imagesService.removeRoomImage(roomId, imageId);
  }
}
