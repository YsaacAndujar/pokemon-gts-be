import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities';
import { Collection } from '../collection/entities/collection.entity';
import { Pokemon } from '../pokemon-mockup/entities';
import { User } from '../auth/entities';
import { PaginationService } from 'src/services';

@Module({
  controllers: [TradesController],
  providers: [TradesService, PaginationService],
  imports: [
    TypeOrmModule.forFeature([ Trade ]),
    TypeOrmModule.forFeature([ Collection ]),
    TypeOrmModule.forFeature([ Pokemon ]),
    TypeOrmModule.forFeature([ User ]),
  ]
})
export class TradesModule {}
