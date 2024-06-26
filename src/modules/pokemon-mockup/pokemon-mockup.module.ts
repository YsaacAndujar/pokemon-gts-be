import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PokemonMockupService } from './pokemon-mockup.service';
import { PokemonMockupController } from './pokemon-mockup.controller';
import { Pokemon, PokemonType } from './entities';
import { PaginationService } from 'src/services';

@Module({
  controllers: [PokemonMockupController],
  providers: [PokemonMockupService, PaginationService],
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    TypeOrmModule.forFeature([PokemonType]),
  ],
})
export class PokemonMockupModule {}
