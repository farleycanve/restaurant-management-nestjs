import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'common/constants/roles';
import { Public } from 'common/decorators';
import { Roles } from 'common/decorators/roles';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post()
  @Public()
  @Roles(Role.Manager)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Manager)
  findAll() {
    return this.authService.findAll();
  }
  @Get('self')
  self(@Request() req: Express.Request) {
    return this.authService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch('password')
  updatePassword(
    @Request() req: Express.Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.id, updatePasswordDto);
  }

  @Patch()
  update(
    @Request() req: Express.Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
