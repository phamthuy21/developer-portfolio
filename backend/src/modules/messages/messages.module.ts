import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

import { AdminMessagesController } from './admin-messages.controller';

@Module({
  controllers: [MessagesController, AdminMessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
