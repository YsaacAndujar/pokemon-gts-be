import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In, Not } from 'typeorm'
import { Trade } from './entities';
import { Collection } from '../collection/entities/collection.entity';
import { PaginationService } from 'src/services';
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';
import { GenericGetPokemonPaginatedDto } from 'src/generic/dto';
import { createPokemonWhereFilter } from 'src/utils/pokemonFilter';
import { AddTradeDto, GetTradesDto } from './dto';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly nonTransactionalTradeRepository: Repository<Trade>,

    // @InjectRepository(Collection)
    // private readonly collectionRepository: Repository<Collection>,

    private readonly paginationService: PaginationService,

    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,

    // @InjectRepository(Pokemon)
    // private readonly pokemonRepository: Repository<Pokemon>,

    private readonly entityManager: EntityManager,
  ) { }

  async findAllMine(filter: GenericGetPokemonPaginatedDto, userId: number) {
    
    return await this.paginationService.paginate(this.nonTransactionalTradeRepository, filter, {
      where:{
        collection: {
          user: { id: userId },
          pokemon: createPokemonWhereFilter(filter)
        }
      },
      relations: ['collection.pokemon',],
    })
  }
  
  async findAll(filter: GetTradesDto, userId: number) {
    
    return await this.paginationService.paginate(this.nonTransactionalTradeRepository, filter, {
      where:{
        collection: {
          user: { id: Not(userId) },
          pokemon: createPokemonWhereFilter(filter.iWantPokemon)
        },
        pokemonsWanted: createPokemonWhereFilter(filter.theyWantPokemon),
      },
      relations: ['collection.pokemon',],
    })
  }

  async addTrade({ collectionId, pokemonsWanted }: AddTradeDto, userId: number) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {

      const collectionRepository = transactionalEntityManager.getRepository(Collection)
      //is this pokemon in my collection?
      const collection = await collectionRepository.findOne({
        where: {
          id: collectionId,
          user: {
            id: userId
          }
        }
      })
      if (!collection) throw new BadRequestException("You don't have this pokemon in your collection")

      const tradeRepository = transactionalEntityManager.getRepository(Trade)
      //is this pokemon in another trade?
      const collectionExitsInTrade = await tradeRepository.findOne({
        where: {
          collection: { id: collectionId }
        }
      })
      if (collectionExitsInTrade) throw new BadRequestException('This pokemon is already in a trade')

      const pokemonRepository = transactionalEntityManager.getRepository(Pokemon)
      const pokemons = await pokemonRepository.find({
        where: {
          id: In(pokemonsWanted)
        }
      })

      if (pokemons.length != pokemonsWanted.length) throw new BadRequestException("Some pokemons wanted doesn't exists")

      await tradeRepository.save({
        collection,
        pokemonsWanted:pokemons
      })
    })
  }

  async removeTrade(id: number, userId: number) {
    const trade = await this.nonTransactionalTradeRepository.findOne({ 
      where: { 
        id, 
        collection:{
          user: {id:userId}
        } 
      } 
    })
    if (!trade) return
    await this.nonTransactionalTradeRepository.delete(id)
    
  }
  
  async GetTrade(id: number) {
    const trade = await this.nonTransactionalTradeRepository.findOne({ 
      where: { id },
      relations: ['collection.pokemon.types', 'pokemonsWanted']
    })
    if (!trade) throw new NotFoundException()
    return trade
    
  }

}
