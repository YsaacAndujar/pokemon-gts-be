import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericGetPokemonPaginatedDto } from 'src/generic/dto';
import { PaginationService } from 'src/services';
import { createPokemonWhereFilter } from 'src/utils/pokemonFilter';
import { Repository, Not, In } from 'typeorm';
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';
import { Trade, TradeRequest } from '../trades/entities';
import { AddPokemonDto } from './dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    private readonly paginationService: PaginationService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(TradeRequest)
    private readonly tradeRequestRepository: Repository<TradeRequest>,
    
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    
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
    const collection = await this.collectionRepository.findOne({ where: { id, user:{id:userId} } })
    if (!collection) return
    await this.collectionRepository.delete(id)
    
  }

  async findAllMine(filter: GenericGetPokemonPaginatedDto, userId: number) {
    
    return await this.paginationService.paginate(this.collectionRepository, filter, {
      where:{
        user: { id: userId },
        pokemon: createPokemonWhereFilter(filter)
      },
      relations: ['pokemon', 'pokemon.types', 'trade'],
    })
  }
  
  async findAllMineAvailable(filter: GenericGetPokemonPaginatedDto, userId: number) {
    const tradeRequests = await this.tradeRequestRepository.find({
      where:{
        collection:{
          user:{
            id: userId
          }
        }
      },
      relations: ['collection']
    })
    const trades = await this.tradeRepository.find({
      where:{
        collection:{
          user:{
            id: userId
          }
        }
      },
      relations: ['collection']
    })
    const tradeRequestIds = [
      ...tradeRequests.map((request) =>(request.collection.id)),
      ...trades.map((trade) =>(trade.collection.id)),
    ]
    return await this.paginationService.paginate(this.collectionRepository, filter, {
      where:{
        user: { id: userId },
        pokemon: createPokemonWhereFilter(filter),
        id: Not(In(tradeRequestIds))
      },
      relations: ['pokemon', 'pokemon.types', 'trade'],
    })
  }
  
  async GetCollection(id: number, userId: number) {
    const collection = await this.collectionRepository.findOne({
      where:{
        id,
        user:{
          id: userId
        }
      },
      relations: ['pokemon.types', 'trade']
    })
    if(!collection) throw new NotFoundException('Collection not found')
      return collection
  }
}
