import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class FindOrdersDto {
  @ApiPropertyOptional({
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
  @ApiPropertyOptional({
    example: '2026-08-20',
    description: 'Filter by pickup date',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
