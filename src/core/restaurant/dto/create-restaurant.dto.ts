import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { FoodType, FoodTypeArray } from '../constants';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 1000)
  url: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(6)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(FoodTypeArray)
  foodType: FoodType;

  @IsNotEmpty()
  @IsString()
  @Length(3, 1000)
  address: string;

  @IsOptional()
  @IsString()
  @Length(3, 1000)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  outcode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  postcode?: string;
}
