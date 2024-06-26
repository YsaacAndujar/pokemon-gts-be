import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity()
export class PokemonType {
  @PrimaryColumn()
  id: number;

  @Column('text', { unique: true })
  name: string;

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.types)
  pokemons: Pokemon[];
}
