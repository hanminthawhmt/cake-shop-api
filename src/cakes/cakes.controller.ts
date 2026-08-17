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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCakeDto } from './dtos/create-cake.dto';
import { Public } from '../users/decorators/public.decorators';
import { Roles } from '../users/decorators/roles.decorator';
import { CakesService } from './cakes.service';
import { UpdateCakeDto } from './dtos/update-cake.dto';

@ApiTags('Cakes')
@Controller('cakes')
export class CakesController {
  constructor(private cakesService: CakesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List all cakes',
    description: 'Returns all cakes currently available in the shop.',
  })
  @ApiResponse({ status: 200, description: 'List of cakes returned successfully.' })
  listCakes() {
    return this.cakesService.findAll();
  }

  @Roles('owner')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a cake',
    description: 'Creates a new cake. This endpoint is restricted to owners.',
  })
  @ApiBody({ type: CreateCakeDto, description: 'Cake payload to create.' })
  @ApiResponse({ status: 201, description: 'Cake created successfully.' })
  @ApiResponse({ status: 400, description: 'Request validation failed.' })
  createCake(@Body() body: CreateCakeDto) {
    return this.cakesService.create(body);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({
    summary: 'Get cake by ID',
    description: 'Fetches a single cake using its numeric identifier.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Cake identifier',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Cake found successfully.' })
  @ApiResponse({ status: 404, description: 'Cake not found.' })
  getCakeById(@Param('id', ParseIntPipe) id: number) {
    return this.cakesService.findOne(id);
  }

  @Roles('owner')
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a cake',
    description: 'Updates an existing cake. Restricted to owners.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cake identifier', example: 1 })
  @ApiBody({ type: UpdateCakeDto, description: 'Updated cake fields.' })
  @ApiResponse({ status: 200, description: 'Cake updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cake not found.' })
  updateCake(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCakeDto,
  ) {
    return this.cakesService.update(id, body);
  }

  @Roles('owner')
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a cake',
    description: 'Deletes a cake. Restricted to owners.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Cake identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Cake deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Cake not found.' })
  deleteCake(@Param('id', ParseIntPipe) id: number) {
    return this.cakesService.remove(id);
  }
}
