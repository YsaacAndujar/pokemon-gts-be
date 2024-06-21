import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { PokemonType } from "./pokemonTypes.entity";

@Entity()
export class Pokemon {
    @PrimaryColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    sprite: string;

    @ManyToMany(() => PokemonType, types => types.pokemons)
    @JoinTable()
    types: PokemonType[];
}

