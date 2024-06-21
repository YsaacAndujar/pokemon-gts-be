import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pokemon, PokemonType } from './entities';

@Injectable()
export class PokemonMockupService {
    constructor (
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
        @InjectRepository(PokemonType)
        private readonly pokemonTypesRepository: Repository<PokemonType>,
    ) {}
    async seed() {

        try {
            await this.insertTypes()
            await this.insertPokemons()
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while processing the operations',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async insertTypes() {
        const promises = [];
        for (let i = 1; i <= 18; i++) {
            promises.push(this.fecthSaveType(i));
        }

        await Promise.all(promises);
    }

    async fecthSaveType(id: number) {
        const exists = await this.pokemonTypesRepository.findOne({
            where:{id}
        })
        if(exists) return
        const response = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        await this.pokemonTypesRepository.save({
            id,
            name:data.name
        })
    }

    async insertPokemons() {
        const promises = [];
        for (let i = 1; i <= 700; i++) {
            promises.push(this.fecthSavePokemon(i));
        }

        await Promise.all(promises);
    }

    async fecthSavePokemon(id: number) {
        const exists = await this.pokemonRepository.findOne({
            where:{id}
        })
        if(exists) return
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        const pokemon: Pokemon = {
            id,
            name: data.name,
            sprite: data.sprites.front_default,
            types: []
        }
        const types = await this.pokemonTypesRepository.find({
            where:{
                name: In(data.types.map((type)=> type.type.name))
            }
        })
        pokemon.types = types;
          await this.pokemonRepository.save(pokemon);

    }
}
