import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade, TradeRequest } from './entities';
import { Collection } from '../collection/entities/collection.entity';
import { Pokemon } from '../pokemon-mockup/entities';
import { User } from '../auth/entities';
import { PaginationService } from 'src/services';
import { NotificationService } from 'src/services/notification.service';
import { HistoryModule } from '../history/history.module';

@Module({
  controllers: [TradesController],
  providers: [TradesService, PaginationService, NotificationService],
  imports: [
    TypeOrmModule.forFeature([ Trade ]),
    TypeOrmModule.forFeature([ Pokemon ]),
    TypeOrmModule.forFeature([ TradeRequest ]),
    HistoryModule
  ]
})
export class TradesModule {}
