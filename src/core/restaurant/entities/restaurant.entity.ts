import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectIdType, WithTimestamps } from 'common/utils/mongoose';

@Schema({ autoIndex: true, timestamps: true })
export class Restaurant implements WithTimestamps {
  @Prop()
  url: string;

  @Prop()
  address: string;

  @Prop()
  addressLine2: string;

  @Prop()
  name: string;

  @Prop()
  outCode: string;

  @Prop()
  postcode: string;

  @Prop()
  rating: number;

  @Prop()
  foodType: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type RestaurantDocument = Restaurant & Document<ObjectIdType | string>;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
