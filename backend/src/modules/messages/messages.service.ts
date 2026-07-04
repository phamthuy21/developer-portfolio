import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { PaginatedResponse } from '../../common/dto/pagination.dto';
import {
  CreateMessageDto,
  MessageResponseDto,
  MessageQueryDto,
  UpdateMessageStatusDto,
} from './dto/message.dto';
import { MessageMapper } from './message.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly messageSelect = {
    id: true,
    name: true,
    email: true,
    subject: true,
    content: true,
    isRead: true,
    createdAt: true,
    deletedAt: true,
  } satisfies Prisma.MessageSelect;

  async create(
    createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.prisma.message.create({
      data: createMessageDto,
      select: this.messageSelect,
    });

    return MessageMapper.toResponseDto(message);
  }

  // --- Admin Methods ---

  async findAllAdmin(
    query: MessageQueryDto,
  ): Promise<PaginatedResponse<MessageResponseDto>> {
    const {
      page = 1,
      limit = 10,
      isRead,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MessageWhereInput = {};
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const orderBy: Prisma.MessageOrderByWithRelationInput = { [sort]: order };

    const [total, messages] = await Promise.all([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
        where,
        select: this.messageSelect,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    return PrismaCrudUtil.paginate(
      messages.map((m) => MessageMapper.toResponseDto(m)),
      total,
      page,
      limit,
    );
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const count = await this.prisma.message.count({
      where: { isRead: false, deletedAt: null },
    });
    return { count };
  }

  async findOneAdmin(id: string): Promise<MessageResponseDto> {
    const message = await this.prisma.message.findUnique({
      where: { id },
      select: this.messageSelect,
    });
    return MessageMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(message, 'Message', id),
    );
  }

  async updateStatus(
    id: string,
    updateMessageStatusDto: UpdateMessageStatusDto,
  ): Promise<MessageResponseDto> {
    const existing = await this.prisma.message.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Message', id);

    const message = await this.prisma.message.update({
      where: { id },
      data: updateMessageStatusDto,
      select: this.messageSelect,
    });
    return MessageMapper.toResponseDto(message);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.message.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Message', id);

    await this.prisma.message.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.message.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Message', id);

    await this.prisma.message.update(PrismaCrudUtil.restore(id));
  }
}
