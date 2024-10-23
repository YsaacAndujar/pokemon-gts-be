import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Min, min } from 'class-validator';

export class GenericGetPaginatedDto {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNotEmpty()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsNotEmpty()
  take?: number = 10;
}
