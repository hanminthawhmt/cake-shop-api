import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Cake } from '../cakes/entities/cake.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Cake) private cakeRepo: Repository<Cake>,
  ) {}

  create(name: string) {
    const category = this.categoryRepo.create({ name });
    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, attrs: Partial<Category>) {
    const category = await this.findOne(id);
    Object.assign(category, attrs);
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    const cakeCount = await this.cakeRepo.count({ where: { categoryId: id } });
    if (cakeCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that still has cakes assigned to it. Reassign or delete those cakes first.',
      );
    }
    await this.categoryRepo.remove(category);
  }
}
