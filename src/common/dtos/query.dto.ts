import { IntersectionType } from "@nestjs/swagger";
import { IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
  /** Default 10 */
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  /** Default 1 */
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;
}

export class SearchStringDto {
  /** Optional query string */
  @IsOptional()
  q?: string;
}

export class SearchWithPaginateDto extends IntersectionType(PaginationQueryDto, SearchStringDto) {}
