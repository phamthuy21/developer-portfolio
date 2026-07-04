import { BlogResponseDto } from './dto/blog.dto';
import { Blog } from '@prisma/client';

export class BlogMapper {
  static toResponseDto(blog: Partial<Blog>): BlogResponseDto {
    const response = new BlogResponseDto();
    response.id = blog.id!;
    response.title = blog.title!;
    response.slug = blog.slug!;
    response.excerpt = blog.excerpt!;
    response.content = blog.content!;
    response.coverImage = blog.coverImage;
    response.createdAt = blog.createdAt!;
    response.updatedAt = blog.updatedAt!;
    response.deletedAt = blog.deletedAt;
    return response;
  }
}
