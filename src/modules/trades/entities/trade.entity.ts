import { Collection } from 'src/modules/collection/entities/collection.entity';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
