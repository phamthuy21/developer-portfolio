import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

import { AdminSkillsController } from './admin-skills.controller';

@Module({
  controllers: [SkillsController, AdminSkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
