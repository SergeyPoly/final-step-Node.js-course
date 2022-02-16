import { IsOptional, IsDate, IsNumber, IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { SortOrder } from '../../common/enums/sort.enum'

export class ProjectsFilterOptionsDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortField?: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number
}
