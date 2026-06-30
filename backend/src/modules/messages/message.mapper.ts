import { MessageResponseDto } from './dto/message.dto';
import { Message } from '@prisma/client';

export class MessageMapper {
  static toResponseDto(message: Partial<Message>): MessageResponseDto {
    const response = new MessageResponseDto();
    response.id = message.id!;
    response.name = message.name!;
    response.email = message.email!;
    response.subject = message.subject!;
    response.content = message.content!;
    response.createdAt = message.createdAt!;
    response.isRead = message.isRead!;
    return response;
  }
}
