import { Controller, Get, Post, Query } from '@nestjs/common';
import { PokemonMockupService } from './pokemon-mockup.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { GenericGetPokemonPaginated } from 'src/generic/dto';


@Controller('pokemon-mockup')
@ApiTags('Pokemon Mockup')
@ApiBearerAuth()
export class PokemonMockupController {
  constructor(private readonly pokemonMockupService: PokemonMockupService) {}

  @Public()
  @Post('seed')
  async login() {
    return await this.pokemonMockupService.seed()
  }
  
  @Get()
  async findAll(@Query() dto: GenericGetPokemonPaginated) {
    return await this.pokemonMockupService.findAll(dto)
  }
  
  @Get('types')
  async findAllTypes() {
    return await this.pokemonMockupService.findAllTypes()
  }
}
