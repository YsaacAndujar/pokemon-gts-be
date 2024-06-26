import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddPokemonDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  pokemonId: number;
}
