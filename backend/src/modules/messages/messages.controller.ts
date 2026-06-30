import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto, MessageResponseDto } from './dto/message.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new contact message' })
  @ApiResponse({
    status: 201,
    description: 'Message successfully created',
    type: MessageResponseDto,
  })
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.messagesService.create(createMessageDto);
  }
}
