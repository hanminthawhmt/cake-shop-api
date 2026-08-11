import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CakeOption } from './entities/cake-option.entity';
import { CakeOptionValue } from './entities/cake-option-value.entity';
import { CakesService } from './cakes.service';
import { CreateCakeOptionDto } from './dtos/create-cake-option.dto';
import { CreateCakeOptionValueDto } from './dtos/create-cake-option-value.dto';
import { UpdateCakeOptionDto } from './dtos/update-cake-option.dto';
import { UpdateCakeOptionValueDto } from './dtos/update-cake-option-value.dto';

@Injectable()
export class CakeOptionsService {
  constructor(
    @InjectRepository(CakeOption) private optionRepo: Repository<CakeOption>,
    @InjectRepository(CakeOptionValue)
    private valueRepo: Repository<CakeOptionValue>,
    private cakesService: CakesService,
  ) {}

  private async verifyOptionBelongsToCake(
    cakeId: number,
    optionId: number,
  ): Promise<CakeOption> {
    const option = await this.optionRepo.findOne({
      where: { id: optionId, cakeId: cakeId },
    });
    if (!option) {
      throw new NotFoundException(
        `Option with ID ${optionId} not found for cake ${cakeId}.`,
      );
    }
    return option;
  }

  private async verifyValueBelongsToOption(
    optionId: number,
    valueId: number,
  ): Promise<CakeOptionValue> {
    const value = await this.valueRepo.findOne({
      where: { id: valueId, cakeOptionId: optionId },
    });
    if (!value) {
      throw new NotFoundException(
        `Value with ID ${valueId} not found for option ${optionId}.`,
      );
    }
    return value;
  }

  async createCakeOption(cakeId: number, dto: CreateCakeOptionDto) {
    const cake = await this.cakesService.findOne(cakeId);
    const option = this.optionRepo.create({ ...dto, cakeId });
    return this.optionRepo.save(option);
  }

  async getOptionsForCake(cakeId: number) {
    const cake = await this.cakesService.findOne(cakeId);
    const options = await this.optionRepo.find({
      where: {
        cakeId: cakeId,
      },
      relations: { values: true },
    });
    return options;
  }

  async updateOption(
    cakeId: number,
    optionId: number,
    dto: UpdateCakeOptionDto,
  ) {
    const option = await this.verifyOptionBelongsToCake(cakeId, optionId);
    this.optionRepo.merge(option, dto);
    return this.optionRepo.save(option);
  }

  async removeOption(cakeId: number, optionId: number) {
    const option = await this.verifyOptionBelongsToCake(cakeId, optionId);
    return this.optionRepo.remove(option);
  }

  async createOptionValue(
    cakeId: number,
    optionId: number,
    dto: CreateCakeOptionValueDto,
  ) {
    const option = await this.verifyOptionBelongsToCake(cakeId, optionId);
    const value = this.valueRepo.create({ ...dto, cakeOptionId: optionId });
    return this.valueRepo.save(value);
  }

  async updateOptionValue(
    cakeId: number,
    optionId: number,
    valueId: number,
    dto: UpdateCakeOptionValueDto,
  ) {
    await this.verifyOptionBelongsToCake(cakeId, optionId);
    const value = await this.verifyValueBelongsToOption(optionId, valueId);
    this.valueRepo.merge(value, dto);
    return this.valueRepo.save(value);
  }

  async removeOptionValue(cakeId: number, optionId: number, valueId: number) {
    await this.verifyOptionBelongsToCake(cakeId, optionId);
    const value = await this.verifyValueBelongsToOption(optionId, valueId);
    return this.valueRepo.remove(value);
  }
}
