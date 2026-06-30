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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto, BlogResponseDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@ApiTags('admin-blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/blogs')
export class AdminBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({
    summary: 'Admin: Get all blogs (including unpublished/deleted)',
  })
  @ApiResponse({ status: 200, type: [BlogResponseDto] })
  async findAll(
    @Query() query: BlogQueryDto,
  ): Promise<PaginatedResponse<BlogResponseDto>> {
    return this.blogsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get blog by ID' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.blogsService.findOneAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create a blog post' })
  @ApiResponse({ status: 201, type: BlogResponseDto })
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: { user: { id: string } },
  ): Promise<BlogResponseDto> {
    return this.blogsService.create(createBlogDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update a blog post' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Soft delete a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.blogsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Admin: Restore a soft-deleted blog post' })
  @ApiResponse({ status: 200, description: 'Blog post restored' })
  async restore(@Param('id') id: string): Promise<void> {
    return this.blogsService.restore(id);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Admin: Publish a blog post' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async publish(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.blogsService.updateStatus(id, 'published', true);
  }

  @Patch(':id/unpublish')
  @ApiOperation({ summary: 'Admin: Unpublish a blog post' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  async unpublish(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.blogsService.updateStatus(id, 'published', false);
  }
}
