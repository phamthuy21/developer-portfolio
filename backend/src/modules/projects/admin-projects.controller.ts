import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto, ProjectResponseDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@ApiTags('admin-projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({
    summary: 'Admin: Get all projects (including unpublished/deleted)',
  })
  @ApiResponse({ status: 200, type: [ProjectResponseDto] })
  async findAll(
    @Query() query: ProjectQueryDto,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    return this.projectsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get project by ID' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create a project' })
  @ApiResponse({ status: 201, type: ProjectResponseDto })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: { user: { id: string } },
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update a project' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted project' })
  @ApiResponse({ status: 200, description: 'Project restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.projectsService.restore(id);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Admin: Publish a project' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async publish(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.updateStatus(id, 'published', true);
  }

  @Patch(':id/unpublish')
  @ApiOperation({ summary: 'Admin: Unpublish a project' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async unpublish(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.updateStatus(id, 'published', false);
  }

  @Patch(':id/feature')
  @ApiOperation({ summary: 'Admin: Feature a project' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async feature(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.updateStatus(id, 'featured', true);
  }

  @Patch(':id/unfeature')
  @ApiOperation({ summary: 'Admin: Unfeature a project' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  async unfeature(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.updateStatus(id, 'featured', false);
  }
}
