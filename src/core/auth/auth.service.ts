import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { hash, plainMatchesHash } from 'common/utils/hashing';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'common/constants/roles';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  onModuleInit() {
    this.initAccountAdmin();
  }
  async initAccountAdmin() {
    const result = await this.userModel.findOne({ username: 'admin' });
    if (!result) {
      this.create({
        username: this.configService.get<string>('ROOT_USER'),
        password: this.configService.get<string>('ROOT_PASSWORD'),
        role: Role.Manager,
      });
    }
  }
  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const result = await this.userModel.findOne({ username });
    if (result) throw new ConflictException('Username is exist');
    const hashedPassword = await hash(password);
    const user = await this.userModel.create<User>({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateUser(username: string, inputPassword: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;
    const { password } = user;
    const match = await plainMatchesHash(inputPassword, password);
    return match ? user : null;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
  async getRole(id: string) {
    const user = await this.userModel.findById(id);
    return user.role;
  }
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.userModel.findOne({ _id: id });
    if (!user) return null;
    const { password } = user;
    const match = await plainMatchesHash(oldPassword, password);
    if (match === null) throw new ForbiddenException('Wrong password');
    const hashedPassword = await hash(newPassword);
    user.password = hashedPassword;
    user.markModified('password');
    await user.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException();
    user.name = updateUserDto.name;
    user.markModified('name');
    await user.save();
    return user;
  }

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: id });
  }
}
