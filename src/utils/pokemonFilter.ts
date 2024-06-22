import { FindOptionsWhere, ILike } from 'typeorm';
import { GenericGetPokemonPaginated } from "src/generic/dto";
import { Pokemon } from 'src/modules/pokemon-mockup/entities';

export const createPokemonWhereFilter = (filter: GenericGetPokemonPaginated) =>{
    let where: FindOptionsWhere<Pokemon> = {};
    if (filter.id) {
      where.id = filter.id
    }
    if (filter.name) {
      where.name=ILike(`%${filter.name}%`)
    }
    if (filter.type) {
      where.types = {id:filter.type}
    }
    return where
}