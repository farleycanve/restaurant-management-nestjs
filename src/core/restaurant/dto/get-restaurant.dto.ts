import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { FoodTypeArray } from '../constants';
import { Type } from 'class-transformer';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
export class RestaurantFilterDto {
  @IsOptional()
  @IsString()
  @IsIn(FoodTypeArray)
  foodType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  @IsIn(['lesser', 'equal', 'greater'])
  operator: 'lesser' | 'equal' | 'greater';
}
