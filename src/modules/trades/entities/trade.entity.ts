import { ManyToOne } from 'typeorm';
import { ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm';
import { Collection } from 'src/modules/collection/entities/collection.entity';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/modules/auth/entities';

@Entity()
export class Trade {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Collection, { cascade: true })
    @JoinColumn()
    collection: Collection;
    
    @ManyToOne(() => User, { cascade: true })
    @JoinColumn()
    user: User;

    @ManyToMany(() => Pokemon, { cascade: true })
    @JoinTable()
    pokemons: Pokemon[];
}
