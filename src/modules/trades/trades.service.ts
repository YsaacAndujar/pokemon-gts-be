import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericGetPokemonPaginatedDto } from 'src/generic/dto';
import { PaginationService } from 'src/services';
import { createPokemonWhereFilter } from 'src/utils/pokemonFilter';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { Collection } from '../collection/entities/collection.entity';
import { Pokemon } from '../pokemon-mockup/entities';
import { AddTradeDto, MakeRequestDto, MyTheirPokemonFilter, UpdateTradeDto } from './dto';
import { Trade, TradeRequest } from './entities';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly nonTransactionalTradeRepository: Repository<Trade>,
    
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    
    @InjectRepository(TradeRequest)
    private readonly nonTransactionalTradeRequestRepository: Repository<TradeRequest>,

    private readonly paginationService: PaginationService,

    private readonly entityManager: EntityManager,
  ) { }

  async findAllMyTrades(filter: GenericGetPokemonPaginatedDto, userId: number) {

    return await this.paginationService.paginate(this.nonTransactionalTradeRepository, filter, {
      where: {
        collection: {
          user: { id: userId },
          pokemon: createPokemonWhereFilter(filter)
        }
      },
      relations: ['collection.pokemon.types',],
    })
  }

  async findAllMyRequests(filter: MyTheirPokemonFilter, userId: number) {
    
    return await this.paginationService.paginate(this.nonTransactionalTradeRequestRepository, filter, {
      where: {
        collection: {
          user: { id: userId },
          pokemon: createPokemonWhereFilter(filter.myPokemon)
        },
        trade: {
          collection: createPokemonWhereFilter(filter.theirPokemon)
        },
      },
    })
  }
  
  async findAllRequestsForMe(filter: MyTheirPokemonFilter, userId: number) {
    
    return await this.paginationService.paginate(this.nonTransactionalTradeRequestRepository, filter, {
      where: {
        collection: {
          pokemon: createPokemonWhereFilter(filter.theirPokemon)
        },
        trade: {
          collection: {
            user: { id: userId },
            ...createPokemonWhereFilter(filter.myPokemon)
          }

        },
      },
    })
  }

  async findAllTrades(filter: MyTheirPokemonFilter, userId: number) {

    return await this.paginationService.paginate(this.nonTransactionalTradeRepository, filter, {
      where: {
        collection: {
          user: { id: Not(userId) },
          pokemon: createPokemonWhereFilter(filter.myPokemon)
        },
        pokemonsWanted: createPokemonWhereFilter(filter.theirPokemon),
      },
      relations: ['collection.pokemon.types',],
    })
  }

  async makeRequest({ tradeId, collectionId }: MakeRequestDto, userId: number) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const tradeRepository = transactionalEntityManager.getRepository(Trade)
      const trade = await tradeRepository.findOne({
        where: { id: tradeId },
        relations: ['collection.user']
      })
      if (!trade) throw new BadRequestException("This trade doens't exists")
      if (trade.collection.user.id == userId) throw new BadRequestException("You can't trade with yourself")

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

      //is this pokemon in another request?
      const tradeRequestRepository = transactionalEntityManager.getRepository(TradeRequest)
      const request = await tradeRequestRepository.findOne({
        where: {
          collection
        }
      })
      if (request) throw new BadRequestException("This pokemon is in another request")
      //TODO: send notification
      await tradeRequestRepository.save({
        collection,
        trade
      })
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
      
        const tradeRequestRepository = transactionalEntityManager.getRepository(TradeRequest)
      //is this pokemon in a request?
      const collectionExitsInRequest = await tradeRequestRepository.findOne({
        where: {
          collection: { id: collectionId }
        }
      })
      if (collectionExitsInRequest) throw new BadRequestException('This pokemon is already in a request')

      const pokemonRepository = transactionalEntityManager.getRepository(Pokemon)
      const pokemons = await pokemonRepository.find({
        where: {
          id: In(pokemonsWanted)
        }
      })

      if (pokemons.length != pokemonsWanted.length) throw new BadRequestException("Some pokemons wanted doesn't exists")

      await tradeRepository.save({
        collection,
        pokemonsWanted: pokemons
      })
    })
  }

  async removeTrade(id: number, userId: number) {
    const trade = await this.nonTransactionalTradeRepository.findOne({
      where: {
        id,
        collection: {
          user: { id: userId }
        }
      }
    })
    if (!trade) return
    await this.nonTransactionalTradeRepository.delete(id)

  }
  
  async patchTrade(id: number, {pokemonsWanted}: UpdateTradeDto, userId: number) {
    let trade = await this.nonTransactionalTradeRepository.findOne({
      where: {
        id,
        collection: {
          user: { id: userId }
        }
      },
      relations: ['pokemonsWanted']
    })
    if (!trade) throw new NotFoundException('Trade not founded')
      const pokemons = await this.pokemonRepository.find({
        where: {
          id: In(pokemonsWanted)
        }
      })
      if (pokemons.length != pokemonsWanted.length) throw new BadRequestException("Some pokemons wanted doesn't exists")
    trade = {...trade, pokemonsWanted: pokemons} 
    await this.nonTransactionalTradeRepository.save(trade)

  }

  async removeRequest(id: number, userId: number) {
    const tradeRequest = await this.nonTransactionalTradeRequestRepository.findOne({
      where: {
        id,
        collection: {
          user: { id: userId }
        }
      }
    })
    if (!tradeRequest) return
    await this.nonTransactionalTradeRepository.delete(id)

  }
  
  async declineTradeRequest(id: number, userId: number) {
    const tradeRequest = await this.nonTransactionalTradeRequestRepository.findOne({
      where: {
        id,
        trade: {
          collection: { id: userId }
        }
      }
    })
    if (!tradeRequest) return
    await this.nonTransactionalTradeRepository.delete(id)

  }
  
  async acceptTradeRequest(id: number, userId: number) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const tradeRequestRepository = transactionalEntityManager.getRepository(TradeRequest)
      const request = await tradeRequestRepository.findOne({
        where:{
          id,
          trade: {
            collection:{
              user:{
                id: userId
              }
            }
          }
        }
      })
      if (request) throw new BadRequestException("This request doesn't exits anymore or it's not for you.")
      
        const collectionRepository = transactionalEntityManager.getRepository(Collection)
        
      await collectionRepository.update(
        request.collection.id,
        {
          user: request.trade.collection.user
        }
      )
      
      await collectionRepository.update(
        request.trade.collection.id,
        {
          user: request.collection.user
        }
      )
      //TODO: notifications
      await tradeRequestRepository.delete(request.trade.id)
    })

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
