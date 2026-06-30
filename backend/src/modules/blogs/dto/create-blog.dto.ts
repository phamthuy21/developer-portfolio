import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'The title of the blog post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'URL-friendly slug, unique' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens',
  })
  slug: string;

  @ApiProperty({ description: 'Short excerpt of the post' })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiProperty({ description: 'Full content (Markdown or HTML)' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
