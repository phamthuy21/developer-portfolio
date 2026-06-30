import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import {
  MessageQueryDto,
  MessageResponseDto,
  UpdateMessageStatusDto,
} from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@ApiTags('admin-messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/messages')
export class AdminMessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: Get all messages (including deleted)' })
  @ApiResponse({ status: 200, type: [MessageResponseDto] })
  async findAll(
    @Query() query: MessageQueryDto,
  ): Promise<PaginatedResponse<MessageResponseDto>> {
    return this.messagesService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get message by ID' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async findOne(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.messagesService.findOneAdmin(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Admin: Update message status (e.g., mark as read)',
  })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateMessageStatusDto,
  ): Promise<MessageResponseDto> {
    return this.messagesService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted message' })
  @ApiResponse({ status: 200, description: 'Message restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.messagesService.restore(id);
  }
}
