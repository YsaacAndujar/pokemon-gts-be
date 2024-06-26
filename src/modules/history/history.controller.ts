import { Controller, Get, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { GenericGetPaginatedDto } from 'src/generic/dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async findAll(@Req() request, @Query() dto: GenericGetPaginatedDto) {
    return await this.historyService.findAll(dto, request.user.userId);
  }


}
