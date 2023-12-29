import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'common/constants/roles';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  username: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
