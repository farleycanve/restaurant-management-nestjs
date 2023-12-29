import { Document, Types, Model, PopulateOptions, FilterQuery } from 'mongoose';

export type ObjectIdType = Types.ObjectId;

export type DocOrLeanDoc<T> = (T & Document) | null;

/**
 * WithTimestamps interface to help type safe entity class that use {timestamps: true}
 */
export interface WithTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Inteface to help with Mongoose Paginate v2
 * https://www.npmjs.com/package/mongoose-paginate-v2
 */
export interface ModelWithPaginate<T> extends Model<T> {
  paginate: (
    query: FilterQuery<T>,
    paginateOptions: PaginateOptions,
  ) => Promise<PaginateResult<T>>;
}

export interface PaginateOptions {
  limit: number;
  page: number;
  select?: object | string;
  sort?: object | string;
  populate?: PopulateOptions | Array<PopulateOptions>;
}

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
}
