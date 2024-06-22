import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPokemonDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm'
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) { }
  
  async addPokemon({ pokemonId }: AddPokemonDto, userId: number) {
    const user = await this.userRepository.findOne({where:{id:userId}})
    const pokemon = await this.pokemonRepository.findOne({where:{id:pokemonId}})
    if (!pokemon) throw new NotFoundException('Pokemon not found')
    this.collectionRepository.save({
      user,
      pokemon
    })
  }
  async removePokemon(id: number, userId: number) {
    
  }
  
  async findAllMine(id: number) {
    
  }
}
