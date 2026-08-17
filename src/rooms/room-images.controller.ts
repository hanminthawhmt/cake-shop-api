import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../users/decorators/roles.decorator';
import { RoomImagesService } from './room-images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Room Images')
@Controller('rooms/:roomId/images')
export class RoomImagesController {
  constructor(private imagesService: RoomImagesService) {}

  @Roles('owner')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload room image',
    description: 'Uploads an image for a room. Restricted to owners.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiParam({ name: 'roomId', type: Number, description: 'Room identifier', example: 1 })
  @ApiResponse({ status: 201, description: 'Room image uploaded successfully.' })
  uploadRoomImage(
    @Param('roomId', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.uploadRoomImage(id, file);
  }

  @Roles('owner')
  @Delete('/:imageId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete room image',
    description: 'Deletes a specific image related to a room.',
  })
  @ApiParam({ name: 'roomId', type: Number, description: 'Room identifier', example: 1 })
  @ApiParam({ name: 'imageId', type: Number, description: 'Image identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Room image removed successfully.' })
  removeRoomImage(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.imagesService.removeRoomImage(roomId, imageId);
  }
}
