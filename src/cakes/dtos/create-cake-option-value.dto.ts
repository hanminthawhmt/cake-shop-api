import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
export class CreateCakeOptionValueDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  priceModifier: number;
}
