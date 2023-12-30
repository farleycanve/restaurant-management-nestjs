import { ApiProperty } from '@nestjs/swagger';
import { FoodType, FoodTypeArray } from '../constants';

export class RestaurantReturnDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ enum: FoodTypeArray })
  foodType: FoodType;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressLine2?: string;

  @ApiProperty()
  outcode?: string;

  @ApiProperty()
  postcode?: string;
}
