import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { ExperienceResponseDto } from './dto/experience.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all experiences ordered as a timeline' })
  @ApiResponse({
    status: 200,
    description: 'List of all experiences',
    type: [ExperienceResponseDto],
  })
  async findAll(): Promise<ExperienceResponseDto[]> {
    return this.experiencesService.findAll();
  }
}
