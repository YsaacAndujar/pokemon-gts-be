import { FindOptionsWhere, ILike } from 'typeorm';
import { GenericGetPokemonDto } from 'src/generic/dto';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';

export const createPokemonWhereFilter = (filter: GenericGetPokemonDto) => {
  const where: FindOptionsWhere<Pokemon> = {};
  if (!filter) return;
  if (filter.id) {
    where.id = filter.id;
  }
  if (filter.name) {
    where.name = ILike(`%${filter.name}%`);
  }
  if (filter.type) {
    where.types = { id: filter.type };
  }
  return where;
};
