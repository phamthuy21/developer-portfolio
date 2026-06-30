import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BlogQueryDto, BlogResponseDto } from './dto/blog.dto';
import { BlogMapper } from './blog.mapper';
import { Prisma } from '@prisma/client';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly blogSelect = {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    content: true,
    coverImage: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.BlogSelect;

  async findAll(
    query: BlogQueryDto,
  ): Promise<PaginatedResponse<BlogResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {
      published: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.BlogOrderByWithRelationInput = {
      [sort]: order,
    };

    const [total, blogs] = await Promise.all([
      this.prisma.blog.count({ where }),
      this.prisma.blog.findMany({
        where,
        select: this.blogSelect,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: blogs.map((b) => BlogMapper.toResponseDto(b)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findBySlug(slug: string): Promise<BlogResponseDto> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        published: true,
        deletedAt: null,
      },
      select: this.blogSelect,
    });

    if (!blog) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    return BlogMapper.toResponseDto(blog);
  }

  // --- Admin Methods ---

  async findAllAdmin(
    query: BlogQueryDto,
  ): Promise<PaginatedResponse<BlogResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.BlogOrderByWithRelationInput = { [sort]: order };

    const [total, blogs] = await Promise.all([
      this.prisma.blog.count({ where }),
      this.prisma.blog.findMany({
        where,
        select: this.blogSelect,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    return PrismaCrudUtil.paginate(
      blogs.map((b) => BlogMapper.toResponseDto(b)),
      total,
      page,
      limit,
    );
  }

  async findOneAdmin(id: string): Promise<BlogResponseDto> {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      select: this.blogSelect,
    });
    return BlogMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(blog, 'Blog', id),
    );
  }

  async create(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<BlogResponseDto> {
    await PrismaCrudUtil.throwIfDuplicate(
      this.prisma.blog,
      { slug: createBlogDto.slug },
      `Blog with slug ${createBlogDto.slug} already exists`,
    );

    const blog = await this.prisma.blog.create({
      data: {
        ...createBlogDto,
        userId,
      },
      select: this.blogSelect,
    });

    return BlogMapper.toResponseDto(blog);
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Blog', id);

    if (updateBlogDto.slug && updateBlogDto.slug !== existing!.slug) {
      await PrismaCrudUtil.throwIfDuplicate(
        this.prisma.blog,
        { slug: updateBlogDto.slug },
        `Blog with slug ${updateBlogDto.slug} already exists`,
      );
    }

    const blog = await this.prisma.blog.update({
      where: { id },
      data: updateBlogDto,
      select: this.blogSelect,
    });

    return BlogMapper.toResponseDto(blog);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Blog', id);

    await this.prisma.blog.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Blog', id);

    await this.prisma.blog.update(PrismaCrudUtil.restore(id));
  }

  async updateStatus(
    id: string,
    field: 'published',
    value: boolean,
  ): Promise<BlogResponseDto> {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Blog', id);

    const blog = await this.prisma.blog.update({
      where: { id },
      data: { [field]: value },
      select: this.blogSelect,
    });
    return BlogMapper.toResponseDto(blog);
  }
}
