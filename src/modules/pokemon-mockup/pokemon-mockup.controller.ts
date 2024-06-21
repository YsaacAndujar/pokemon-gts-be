import { Controller, Post } from '@nestjs/common';
import { PokemonMockupService } from './pokemon-mockup.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

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
}
