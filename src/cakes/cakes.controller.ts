import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCakeDto } from './dtos/create-cake.dto';
import { Public } from '../users/decorators/public.decorators';
import { Roles } from '../users/decorators/roles.decorator';
import { CakesService } from './cakes.service';
import { UpdateCakeDto } from './dtos/update-cake.dto';

@Controller('cakes')
export class CakesController {
  constructor(private cakesService: CakesService) {}

  @Public()
  @Get()
  listCakes() {
    return this.cakesService.findAll();
  }

  @Roles('owner')
  @Post()
  createCake(@Body() body: CreateCakeDto) {
    return this.cakesService.create(body);
  }

  @Public()
  @Get('/:id')
  getCakeById(@Param('id', ParseIntPipe) id: number) {
    return this.cakesService.findOne(id);
  }

  @Roles('owner')
  @Patch('/:id')
  updateCake(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCakeDto,
  ) {
    return this.cakesService.update(id, body);
  }

  @Roles('owner')
  @Delete('/:id')
  deleteCake(@Param('id', ParseIntPipe) id: number) {
    return this.cakesService.remove(id);
  }
}
