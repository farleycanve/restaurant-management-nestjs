import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class PaginatedResponseDto {
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  next?: number;
  @ApiProperty()
  prev?: number;

  // docs: TData[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(PaginatedResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
