import {
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  Min,
} from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  @IsPositive()
  cakeId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  selectedValueIds: number[];
}