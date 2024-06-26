import { Controller, Get, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { GenericGetPaginatedDto } from 'src/generic/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('history')
@ApiTags('History')
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async findAll(@Req() request, @Query() dto: GenericGetPaginatedDto) {
    return await this.historyService.findAll(dto, request.user.userId);
  }
}
