import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Pokemon } from "./pokemon.entity";

@Entity()
export class PokemonType {
    @PrimaryColumn()
    id: number;
    
    @Column('text', {unique:true})
    name: string;    

    @ManyToMany(() => Pokemon, pokemon => pokemon.types)
    @JoinTable()
    pokemons: Pokemon[];
}

