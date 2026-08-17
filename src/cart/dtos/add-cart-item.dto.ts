import {
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 1, description: 'Cake identifier to add to the cart.' })
  @IsInt()
  @IsPositive()
  cakeId: number;

  @ApiProperty({ example: 2, description: 'Quantity to add to the cart.', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    example: 'Extra frosting',
    description: 'Optional note for the cart item.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [Number],
    example: [3, 7],
    description: 'IDs of selected option values to attach to the item.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  selectedValueIds: number[];
}