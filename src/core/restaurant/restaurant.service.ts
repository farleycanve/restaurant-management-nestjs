import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ModelWithPaginate, PaginateOptions } from 'common/utils/mongoose';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQueryDto } from 'common/dtos/query.dto';
import { RestaurantFilterDto } from './dto/get-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: ModelWithPaginate<RestaurantDocument>,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantModel.create<Restaurant>({
      ...createRestaurantDto,
    });
    return restaurant;
  }

  async findAllPaginate(
    paginateQueryDto: PaginationQueryDto,
    restaurantFilterDto: RestaurantFilterDto,
  ) {
    let { limit, page } = paginateQueryDto;
    const DEFAULT_LIMIT = 10;
    const DEFAULT_PAGE = 1;
    limit = limit || DEFAULT_LIMIT;
    page = page || DEFAULT_PAGE;

    const options: PaginateOptions = {
      sort: { name: 1 },
      limit,
      page,
    };
    let filter = {};
    const { operator, rating, ...filterOthers } = restaurantFilterDto;
    if (operator && rating) {
      if (operator === 'lesser') {
        filter = { rating: { $lt: rating } };
      }
      if (operator === 'equal') {
        filter = { rating: { $eq: rating } };
      }
      if (operator === 'greater') {
        filter = { rating: { $gt: rating } };
      }
    }
    const result = await this.restaurantModel.paginate(
      { ...filterOthers, ...filter },
      options,
    );
    const toReturn = {
      restaurants: result.docs,
      totalCount: result.totalDocs,
      totalPages: result.totalPages,
      limit: result.limit,
      page: result.page,
      prev: result.prevPage || undefined,
    };
    return toReturn;
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      updateRestaurantDto,
      { new: true },
    );
    return updatedRestaurant;
  }

  async remove(id: string) {
    const restaurant = await this.restaurantModel.deleteOne({ _id: id });
    return restaurant;
  }
}
