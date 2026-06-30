import { NotFoundException, ConflictException } from '@nestjs/common';
import { PaginatedResponse } from '../dto/pagination.dto';

export class PrismaCrudUtil {
  static throwIfNotFound<T>(
    entity: T | null,
    entityName: string,
    id: string,
  ): T {
    if (!entity) {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    return entity;
  }

  static async exists(
    model: { count: (args: { where: any }) => Promise<number> },
    where: Record<string, any>,
  ): Promise<boolean> {
    const count = await model.count({ where });
    return count > 0;
  }

  static async throwIfDuplicate(
    model: { count: (args: { where: any }) => Promise<number> },
    where: Record<string, any>,
    errorMessage: string,
  ): Promise<void> {
    const isDuplicate = await this.exists(model, where);
    if (isDuplicate) {
      throw new ConflictException(errorMessage);
    }
  }

  static softDelete(id: string) {
    return {
      where: { id },
      data: { deletedAt: new Date() },
    };
  }

  static restore(id: string) {
    return {
      where: { id },
      data: { deletedAt: null },
    };
  }

  static getPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  static paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      data,
      meta: this.getPaginationMeta(total, page, limit),
    };
  }
}
