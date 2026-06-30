import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectQueryDto, ProjectResponseDto } from './dto/project.dto';
import { Public } from '../auth/decorators/public.decorator';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published projects' })
  @ApiResponse({
    status: 200,
    description: 'List of published projects',
    type: [ProjectResponseDto],
  })
  async findAll(
    @Query() query: ProjectQueryDto,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    return this.projectsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a project by slug' })
  @ApiParam({ name: 'slug', description: 'The project slug' })
  @ApiResponse({
    status: 200,
    description: 'The project details',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('slug') slug: string): Promise<ProjectResponseDto> {
    return this.projectsService.findBySlug(slug);
  }
}
