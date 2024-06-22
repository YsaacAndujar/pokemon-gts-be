import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPokemonDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Repository, FindOptionsWhere, ILike } from 'typeorm'
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';
import { GenericGetPokemonPaginated } from 'src/generic/dto';
import { PaginationService } from 'src/services';
import { createPokemonWhereFilter } from 'src/utils/pokemonFilter';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    private readonly paginationService: PaginationService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) { }

  async addPokemon({ pokemonId }: AddPokemonDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const pokemon = await this.pokemonRepository.findOne({ where: { id: pokemonId } })
    if (!pokemon) throw new NotFoundException('Pokemon not found')
    this.collectionRepository.save({
      user,
      pokemon
    })
  }
  async removePokemon(id: number, userId: number) {

  }

  async findAllMine(filter: GenericGetPokemonPaginated, userId: number) {
    
    return await this.paginationService.paginate(this.collectionRepository, filter, {
      where:{
        user: { id: userId },
        pokemon: createPokemonWhereFilter(filter)
      },
      relations: ['pokemon', 'pokemon.types'],
    })
  }
}
