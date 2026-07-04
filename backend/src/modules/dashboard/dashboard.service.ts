import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<DashboardStatsDto> {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalSkills,
      totalExperiences,
      totalCertificates,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({
        where: { published: true, deletedAt: null },
      }),
      this.prisma.project.count({
        where: { published: false, deletedAt: null },
      }),
      this.prisma.blog.count({ where: { deletedAt: null } }),
      this.prisma.blog.count({ where: { published: true, deletedAt: null } }),
      this.prisma.blog.count({ where: { published: false, deletedAt: null } }),
      this.prisma.skill.count({ where: { deletedAt: null } }),
      this.prisma.experience.count({ where: { deletedAt: null } }),
      this.prisma.certificate.count({ where: { deletedAt: null } }),
      this.prisma.message.count({ where: { deletedAt: null } }),
      this.prisma.message.count({ where: { isRead: false, deletedAt: null } }),
    ]);

    return {
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalSkills,
      totalExperiences,
      totalCertificates,
      totalMessages,
      unreadMessages,
    };
  }
}
