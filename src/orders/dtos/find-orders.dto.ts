import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class FindOrdersDto {
  @IsOptional() @IsEnum(OrderStatus) status?: OrderStatus;
  @IsOptional() @IsDateString() date?: string;
}
