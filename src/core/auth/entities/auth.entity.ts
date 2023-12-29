import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { Role, RoleArray } from 'common/constants/roles';
import { WithTimestamps } from 'common/utils/mongoose';

@Schema({ timestamps: true })
export class User implements WithTimestamps {
  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: String, private: true, required: true })
  @Exclude()
  password: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: Number, enum: RoleArray, required: true })
  role: Role;

  createdAt?: Date;
  updatedAt?: Date;
}
export type UserDocument = User & Document<ObjectId | string>;
export const UserSchema = SchemaFactory.createForClass(User);
