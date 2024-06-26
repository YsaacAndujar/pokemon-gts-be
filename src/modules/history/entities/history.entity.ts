import { Column } from 'typeorm';
import { User } from 'src/modules/auth/entities';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Pokemon, pokemon => pokemon.collections, {onDelete: 'CASCADE'})
    myPokemon: Pokemon;

    @ManyToOne(() => Pokemon, pokemon => pokemon.collections, {onDelete: 'CASCADE'})
    hisPokemon: Pokemon;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    user: User;
    
    @Column('boolean')
    myTrade: boolean

}