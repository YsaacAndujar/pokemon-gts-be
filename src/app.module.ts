import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards';
import { PokemonMockupModule } from './modules/pokemon-mockup/pokemon-mockup.module';
import { PaginationService } from './services';
import { CollectionModule } from './modules/collection/collection.module';
import { TradesModule } from './modules/trades/trades.module';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PokemonMockupModule,
    CollectionModule,
    TradesModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    PaginationService,
  ],
})
export class AppModule {}
