import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Trade } from './trade.entity';
import { Collection } from 'src/modules/collection/entities/collection.entity';

@Entity()
export class TradeRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Trade, { onDelete: 'CASCADE' })
    @JoinTable()
    trade: Trade;
    
    @OneToOne(() => Collection, collection => collection.tradeRequest, { onDelete: 'CASCADE' })
    @JoinColumn()
    collection: Collection;
}