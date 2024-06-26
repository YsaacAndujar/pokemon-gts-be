import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericGetPaginatedDto } from 'src/generic/dto';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm'
import { PaginationService } from 'src/services';

@Injectable()
export class HistoryService {
  
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly paginationService: PaginationService,
  ) { }

  async findAll(filter: GenericGetPaginatedDto, userId: number) {
    return await this.paginationService.paginate(this.historyRepository, filter, {
      where:{
        user: { id: userId },
      },
    })
  }

}
