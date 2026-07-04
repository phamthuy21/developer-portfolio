import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total projects (excluding soft deleted)' })
  totalProjects: number;

  @ApiProperty({ description: 'Published projects' })
  publishedProjects: number;

  @ApiProperty({ description: 'Draft projects' })
  draftProjects: number;

  @ApiProperty({ description: 'Total blogs (excluding soft deleted)' })
  totalBlogs: number;

  @ApiProperty({ description: 'Published blogs' })
  publishedBlogs: number;

  @ApiProperty({ description: 'Draft blogs' })
  draftBlogs: number;

  @ApiProperty({ description: 'Total skills (excluding soft deleted)' })
  totalSkills: number;

  @ApiProperty({ description: 'Total experiences (excluding soft deleted)' })
  totalExperiences: number;

  @ApiProperty({ description: 'Total certificates (excluding soft deleted)' })
  totalCertificates: number;

  @ApiProperty({ description: 'Total messages (excluding soft deleted)' })
  totalMessages: number;

  @ApiProperty({ description: 'Unread messages' })
  unreadMessages: number;
}
