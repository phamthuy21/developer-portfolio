import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { SkillResponseDto } from './dto/skill.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all skills grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'List of all skills organized by category',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SkillResponseDto',
        },
      },
    },
  })
  async findAll(): Promise<Record<string, SkillResponseDto[]>> {
    return this.skillsService.findAll();
  }
}
