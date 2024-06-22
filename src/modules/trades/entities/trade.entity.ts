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
    
    @ManyToMany(() => Pokemon, { cascade: true })
    @JoinTable()
    pokemonsWanted: Pokemon[];
}
