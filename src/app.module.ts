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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
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
