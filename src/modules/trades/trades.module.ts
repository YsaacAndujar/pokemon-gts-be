import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/services';
import { NotificationService } from 'src/services/notification.service';
import { HistoryModule } from '../history/history.module';
import { Pokemon } from '../pokemon-mockup/entities';
import { Trade, TradeRequest } from './entities';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  controllers: [TradesController],
  providers: [TradesService, PaginationService, NotificationService],
  imports: [
    TypeOrmModule.forFeature([Trade]),
    TypeOrmModule.forFeature([Pokemon]),
    TypeOrmModule.forFeature([TradeRequest]),
    HistoryModule,
  ],
})
export class TradesModule {}
