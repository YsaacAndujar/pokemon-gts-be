import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { TradesService } from './trades.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericGetPokemonPaginatedDto } from 'src/generic/dto';
import { AddTradeDto, GetTradesDto, MakeRequestDto } from './dto';

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
  async findAllMine(@Req() request, @Query() dto: GenericGetPokemonPaginatedDto) {
    return await this.tradesService.findAllMine(dto, request.user.userId);
  }
  
  //has to be a post so I can have the filter, sorry :P
  @Post('get-all-trades')
  async findAll(@Req() request, @Body() dto: GetTradesDto) {
    return await this.tradesService.findAll(dto, request.user.userId);
  }
  
  @Post('make-request')
  async makeRequest(@Req() request, @Body() dto: MakeRequestDto) {
    return await this.tradesService.makeRequest(dto, request.user.userId);
  }
  
  @Delete('my-trades/:id')
  async removeTrade(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return await this.tradesService.removeTrade(id, request.user.userId);
  }
  
  @Delete('my-requests/:id')
  async removeRequest(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return await this.tradesService.removeRequest(id, request.user.userId);
  }

  @Get('/:id')
  async GetTrade(@Param('id', ParseIntPipe) id: number) {
    return await this.tradesService.GetTrade(id);
  }
}
