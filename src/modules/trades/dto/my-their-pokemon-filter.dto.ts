import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { GenericGetPaginatedDto } from 'src/generic/dto';
import { GenericGetPokemonDto } from 'src/generic/dto/GenericGetPokemon.dto';

export class MyTheirPokemonFilter extends GenericGetPaginatedDto {
  @ApiProperty({ type: GenericGetPokemonDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GenericGetPokemonDto)
  myPokemon?: GenericGetPokemonDto;

  @ApiProperty({ type: GenericGetPokemonDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GenericGetPokemonDto)
  theirPokemon?: GenericGetPokemonDto;
}
