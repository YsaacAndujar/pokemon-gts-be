import { User } from 'src/modules/auth/entities';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pokemon, pokemon => pokemon.collections)
    pokemon: Pokemon;

    @ManyToOne(() => User, user => user.userCodes)
    user: User;
}


