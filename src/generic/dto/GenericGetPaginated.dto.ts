import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GenericGetPaginatedDto {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  @Transform((param) => parseInt(param.value))
  page?: number = 1;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsNotEmpty()
  take?: number = 10;
}
