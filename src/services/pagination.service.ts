import { Injectable } from '@nestjs/common';
import { GenericGetPaginatedDto } from 'src/generic/dto';
import { FindManyOptions, Repository } from 'typeorm'

@Injectable()
export class PaginationService {

    protected createOrderQuery() {
        const order: any = {};
    
        order.id = 'DESC';
        return order;
      }
    

    async paginate<T>(
        repository: Repository<T>,
        {take, page}: GenericGetPaginatedDto,
        findManyOptions?: FindManyOptions<T>,
      ) {
        const [result, total] = await repository.findAndCount({
          order: this.createOrderQuery(),
          ...findManyOptions,
              take: take,
              skip: (page-1)*take,
          });
    
        return {
          result,
          total
        }

      }
}
