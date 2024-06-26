import { User } from 'src/modules/auth/entities';
import { Pokemon } from 'src/modules/pokemon-mockup/entities';
import { Trade, TradeRequest } from 'src/modules/trades/entities';
import { Entity, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.collections, {
    onDelete: 'CASCADE',
  })
  pokemon: Pokemon;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Trade, (trade) => trade.collection)
  trade: Trade;

  @OneToOne(() => TradeRequest, (tradeRequest) => tradeRequest.collection)
  tradeRequest: TradeRequest;
}
