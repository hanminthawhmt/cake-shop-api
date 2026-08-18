import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cake } from './entities/cake.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateCakeDto } from './dtos/create-cake.dto';
import { UpdateCakeDto } from './dtos/update-cake.dto';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(Cake) private cakeRepo: Repository<Cake>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCakeDto) {
    await this.verifyCategoryExists(dto.categoryId);
    const cake = this.cakeRepo.create(dto);
    return this.cakeRepo.save(cake);
  }

  findAll() {
    return this.cakeRepo.find({
      relations: { images: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const cake = await this.cakeRepo.findOne({
      where: { id },
      relations: { category: true, images: true, options: { values: true } },
    });

    if (!cake) {
      throw new NotFoundException(`Cake with ID ${id} not found`);
    }
    return cake;
  }

  async update(id: number, updateDto: UpdateCakeDto) {
    const cake = await this.findOne(id);
    if (updateDto.categoryId) {
      await this.verifyCategoryExists(updateDto.categoryId);
    }
    this.cakeRepo.merge(cake, updateDto);
    return this.cakeRepo.save(cake);
  }

  async remove(id: number) {
    const cake = await this.findOne(id);
    await this.cakeRepo.remove(cake);
  }

  private async verifyCategoryExists(categoryId: number): Promise<void> {
    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }
  }
}
