import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectIdType, WithTimestamps } from 'common/utils/mongoose';
import { FoodType, FoodTypeArray } from '../constants';

@Schema({ autoIndex: true, timestamps: true })
export class Restaurant implements WithTimestamps {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, enum: FoodTypeArray, required: true })
  foodType: FoodType;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String })
  addressLine2?: string;

  @Prop({ type: String })
  outcode?: string;

  @Prop({ type: String })
  postcode?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type RestaurantDocument = Restaurant & Document<ObjectIdType | string>;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
