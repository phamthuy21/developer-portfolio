import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

import { AdminExperiencesController } from './admin-experiences.controller';

@Module({
  controllers: [ExperiencesController, AdminExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
