import { Controller, Get, Post, Query } from '@nestjs/common';
import { PokemonMockupService } from './pokemon-mockup.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { GetPaginatedPokemons } from './dto/GetPaginatedPokemons.dto';

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
  
  @Public()
  @Get()
  async findAll(@Query() dto: GetPaginatedPokemons) {
    return await this.pokemonMockupService.findAll(dto)
  }
  
  @Public()
  @Get('types')
  async findAllTypes() {
    return await this.pokemonMockupService.findAllTypes()
  }
}
