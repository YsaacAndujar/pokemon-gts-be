import { TradeRequest } from './../trades/entities/request.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/services';
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';
import { Trade } from '../trades/entities';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, PaginationService],
  imports:[
    TypeOrmModule.forFeature([ Collection ]),
    TypeOrmModule.forFeature([ Trade ]),
    TypeOrmModule.forFeature([ Pokemon ]),
    TypeOrmModule.forFeature([ TradeRequest ]),
    TypeOrmModule.forFeature([ User ]),
]
})
export class CollectionModule {}
