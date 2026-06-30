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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('admin-skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/skills')
export class AdminSkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: Get all skills (flat list)' })
  @ApiResponse({ status: 200, type: [SkillResponseDto] })
  async findAll(): Promise<SkillResponseDto[]> {
    return this.skillsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get skill by ID' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  async findOne(@Param('id') id: string): Promise<SkillResponseDto> {
    return this.skillsService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create a skill' })
  @ApiResponse({ status: 201, type: SkillResponseDto })
  async create(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.skillsService.create(createSkillDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update a skill' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete a skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.skillsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted skill' })
  @ApiResponse({ status: 200, description: 'Skill restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.skillsService.restore(id);
  }
}
