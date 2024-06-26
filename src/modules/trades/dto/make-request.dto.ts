import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakeRequestDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  tradeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  collectionId: number;
}
