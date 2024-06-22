import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, OneToOne } from 'typeorm';
import { Trade } from './trade.entity';
import { Collection } from 'src/modules/collection/entities/collection.entity';

@Entity()
export class TradeRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Trade, { cascade: true })
    @JoinTable()
    trade: Trade;
    
    @OneToOne(() => Collection, { cascade: true })
    @JoinTable()
    collection: Collection;
}