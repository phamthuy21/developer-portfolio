import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { BlogQueryDto, BlogResponseDto } from './dto/blog.dto';
import { Public } from '../auth/decorators/public.decorator';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published blog posts' })
  @ApiResponse({
    status: 200,
    description: 'List of published blog posts',
    type: [BlogResponseDto],
  })
  async findAll(
    @Query() query: BlogQueryDto,
  ): Promise<PaginatedResponse<BlogResponseDto>> {
    return this.blogsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiParam({ name: 'slug', description: 'The blog slug' })
  @ApiResponse({
    status: 200,
    description: 'The blog post details',
    type: BlogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async findOne(@Param('slug') slug: string): Promise<BlogResponseDto> {
    return this.blogsService.findBySlug(slug);
  }
}
