import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { PokemonType } from "./pokemonTypes.entity";
import { Collection } from "src/modules/collection/entities/collection.entity";

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
    types?: PokemonType[];

    @OneToMany(() => Collection, collection => collection.pokemon)
    collections?: Collection[];
}

