import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsInt,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCakeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId: number;
}
