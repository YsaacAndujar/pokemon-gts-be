import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { TradesService } from './trades.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddTradeDto } from './dto/add-trade.dto';
import { GenericGetPokemonPaginated } from 'src/generic/dto';

@Controller('trades')
@ApiTags('Trades')
@ApiBearerAuth()
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}
  
  @Post('add-trade')
  async addTrade(@Body() dto: AddTradeDto, @Req() request) {
    return await this.tradesService.addTrade(dto, request.user.userId);
  }

  @Get('my-trades')
  async findAllMine(@Req() request, @Query() dto: GenericGetPokemonPaginated) {
    return await this.tradesService.findAllMine(dto, request.user.userId);
  }
  
}
