import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { PaginationService } from 'src/services';
import { HistoryGateway } from './hsitory.gateway';
import { AuthGuard } from 'src/guards';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PaginationService, HistoryGateway, AuthGuard],
  exports: [HistoryGateway],
  imports: [
    TypeOrmModule.forFeature([ History ]),
  ]
})
export class HistoryModule {}
