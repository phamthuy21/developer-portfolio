import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponseDto } from './dto/experience.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('admin-experiences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/experiences')
export class AdminExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: Get all experiences (including deleted)' })
  @ApiResponse({ status: 200, type: [ExperienceResponseDto] })
  async findAll(): Promise<ExperienceResponseDto[]> {
    return this.experiencesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get experience by ID' })
  @ApiResponse({ status: 200, type: ExperienceResponseDto })
  async findOne(@Param('id') id: string): Promise<ExperienceResponseDto> {
    return this.experiencesService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create an experience' })
  @ApiResponse({ status: 201, type: ExperienceResponseDto })
  async create(
    @Body() createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.experiencesService.create(createExperienceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update an experience' })
  @ApiResponse({ status: 200, type: ExperienceResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete an experience' })
  @ApiResponse({ status: 200, description: 'Experience deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.experiencesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted experience' })
  @ApiResponse({ status: 200, description: 'Experience restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.experiencesService.restore(id);
  }
}
