import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { PaginationService } from 'src/services';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PaginationService],
  imports: [
    TypeOrmModule.forFeature([ History ]),
  ]
})
export class HistoryModule {}
