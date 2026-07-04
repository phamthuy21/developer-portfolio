import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectQueryDto, ProjectResponseDto } from './dto/project.dto';
import { ProjectMapper } from './project.mapper';
import { Prisma } from '@prisma/client';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginatedResponse } from '../../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly projectSelect = {
    id: true,
    title: true,
    slug: true,
    description: true,
    content: true,
    githubUrl: true,
    liveUrl: true,
    imageUrl: true,
    featured: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    skills: {
      select: {
        skill: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            category: true,
          },
        },
      },
    },
  } satisfies Prisma.ProjectSelect;

  async findAll(
    query: ProjectQueryDto,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      featured,
      skill,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      published: true,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (skill) {
      where.skills = {
        some: {
          skill: { slug: skill },
        },
      };
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = {
      [sort]: order,
    };

    const [total, projects] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        select: this.projectSelect,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects.map((p) => ProjectMapper.toResponseDto(p)),
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

  async findBySlug(slug: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: {
        slug,
        published: true,
        deletedAt: null,
      },
      select: this.projectSelect,
    });

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return ProjectMapper.toResponseDto(project);
  }

  // --- Admin Methods ---

  async findAllAdmin(
    query: ProjectQueryDto,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = { [sort]: order };

    const [total, projects] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        select: this.projectSelect,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    return PrismaCrudUtil.paginate(
      projects.map((p) => ProjectMapper.toResponseDto(p as any)),
      total,
      page,
      limit,
    );
  }

  async findOneAdmin(id: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: this.projectSelect,
    });
    return ProjectMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(project, 'Project', id),
    );
  }

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponseDto> {
    const slug =
      createProjectDto.slug ||
      createProjectDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    await PrismaCrudUtil.throwIfDuplicate(
      this.prisma.project,
      { slug },
      `Project with slug ${slug} already exists`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skillIds, technologies, slug: _slug, ...data } = createProjectDto;

    const project = await this.prisma.$transaction(async (prisma) => {
      let finalSkillIds: string[] = skillIds || [];
      if (technologies && technologies.length > 0) {
        const skills = await Promise.all(
          technologies.map(async (name) => {
            const s = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
            let skill = await prisma.skill.findUnique({ where: { slug: s } });
            if (!skill) {
              skill = await prisma.skill.create({
                data: { name, slug: s, category: 'General' },
              });
            }
            return skill.id;
          }),
        );
        finalSkillIds = [...new Set([...finalSkillIds, ...skills])];
      }

      return prisma.project.create({
        data: {
          ...data,
          slug,
          userId,
          skills: finalSkillIds.length
            ? {
                create: finalSkillIds.map((skillId) => ({ skillId })),
              }
            : undefined,
        },
        select: this.projectSelect,
      });
    });

    return ProjectMapper.toResponseDto(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Project', id);

    let slug = updateProjectDto.slug;
    if (!slug && updateProjectDto.title) {
      slug = updateProjectDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (slug && slug !== existing!.slug) {
      await PrismaCrudUtil.throwIfDuplicate(
        this.prisma.project,
        { slug },
        `Project with slug ${slug} already exists`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skillIds, technologies, slug: _slug, ...data } = updateProjectDto;

    const project = await this.prisma.$transaction(async (prisma) => {
      let finalSkillIds: string[] | undefined = skillIds;

      if (technologies) {
        finalSkillIds = finalSkillIds || [];
        const skills = await Promise.all(
          technologies.map(async (name) => {
            const s = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
            let skill = await prisma.skill.findUnique({ where: { slug: s } });
            if (!skill) {
              skill = await prisma.skill.create({
                data: { name, slug: s, category: 'General' },
              });
            }
            return skill.id;
          }),
        );
        finalSkillIds = [...new Set([...finalSkillIds, ...skills])];
      }

      if (finalSkillIds !== undefined) {
        await prisma.projectSkill.deleteMany({ where: { projectId: id } });
      }

      return prisma.project.update({
        where: { id },
        data: {
          ...data,
          ...(slug && { slug }),
          skills:
            finalSkillIds !== undefined
              ? {
                  create: finalSkillIds.map((skillId) => ({ skillId })),
                }
              : undefined,
        },
        select: this.projectSelect,
      });
    });

    return ProjectMapper.toResponseDto(project);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Project', id);

    await this.prisma.project.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Project', id);

    await this.prisma.project.update(PrismaCrudUtil.restore(id));
  }

  async updateStatus(
    id: string,
    field: 'published' | 'featured',
    value: boolean,
  ): Promise<ProjectResponseDto> {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Project', id);

    const project = await this.prisma.project.update({
      where: { id },
      data: { [field]: value },
      select: this.projectSelect,
    });
    return ProjectMapper.toResponseDto(project);
  }
}
