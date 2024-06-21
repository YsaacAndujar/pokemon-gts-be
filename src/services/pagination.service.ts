import { Injectable } from '@nestjs/common';
import { GenericGetPaginatedDto } from 'src/generic/dto';
import { FindManyOptions, Repository } from 'typeorm'

@Injectable()
export class PaginationService {

  async paginate<T>(
    repository: Repository<T>,
    { take, page }: GenericGetPaginatedDto,
    findManyOptions?: FindManyOptions<T>,
  ) {
    const metadata = repository.metadata;
    const hasIdColumn = metadata.columns.some(column => column.propertyName === 'id');

    const queryOptions: FindManyOptions<T> = {
      ...findManyOptions,
      take: take,
      skip: (page - 1) * take,
    };

    if (hasIdColumn) {
      queryOptions.order = { id: 'DESC' } as any;
    }

    const [result, total] = await repository.findAndCount(queryOptions);

    return {
      result,
      total,
    };
  }
}
