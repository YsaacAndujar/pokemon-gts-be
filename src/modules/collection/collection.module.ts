import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection } from './entities/collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities';
import { Pokemon } from '../pokemon-mockup/entities';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports:[
    TypeOrmModule.forFeature([ Collection ]),
    TypeOrmModule.forFeature([ Pokemon ]),
    TypeOrmModule.forFeature([ User ]),
]
})
export class CollectionModule {}