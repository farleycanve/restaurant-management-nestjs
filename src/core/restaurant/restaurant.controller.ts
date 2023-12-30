import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationQueryDto } from 'common/dtos/query.dto';
import { RestaurantFilterDto } from './dto/get-restaurant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'common/dtos/return-pagination.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantReturnDto } from './dto/return-restaurant';
import { TimeoutInterceptor } from 'interceptor/timeout.interceptor';
import { HttpExceptionFilter } from 'exception-filter/http-exception.filter';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseInterceptors(TimeoutInterceptor)
@UseFilters(new HttpExceptionFilter())
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(createRestaurantDto);
    return restaurant as RestaurantReturnDto;
  }

  @Get()
  @ApiPaginatedResponse(Restaurant)
  async findAll(
    @Query() paginateQueryDto: PaginationQueryDto,
    @Query() restaurantFilterDto: RestaurantFilterDto,
  ) {
    const result = await this.restaurantService.findAllPaginate(
      paginateQueryDto,
      restaurantFilterDto,
    );

    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findOne(id);
    return restaurant as RestaurantReturnDto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantService.update(
      id,
      updateRestaurantDto,
    );
    return restaurant as RestaurantReturnDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.restaurantService.remove(id);
  }
}
