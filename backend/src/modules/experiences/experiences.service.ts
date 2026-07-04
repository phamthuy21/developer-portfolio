import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExperienceResponseDto } from './dto/experience.dto';
import { ExperienceMapper } from './experience.mapper';
import { Prisma } from '@prisma/client';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly experienceSelect = {
    id: true,
    company: true,
    position: true,
    location: true,
    startDate: true,
    endDate: true,
    current: true,
    description: true,
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
  } satisfies Prisma.ExperienceSelect;

  async findAll(): Promise<ExperienceResponseDto[]> {
    const experiences = await this.prisma.experience.findMany({
      where: {
        deletedAt: null,
      },
      select: this.experienceSelect,
      orderBy: {
        startDate: 'desc',
      },
    });

    return experiences.map((exp) => ExperienceMapper.toResponseDto(exp));
  }

  // --- Admin Methods ---

  async findAllAdmin(): Promise<ExperienceResponseDto[]> {
    const experiences = await this.prisma.experience.findMany({
      select: this.experienceSelect,
      orderBy: { startDate: 'desc' },
    });
    return experiences.map((exp) => ExperienceMapper.toResponseDto(exp));
  }

  async findOneAdmin(id: string): Promise<ExperienceResponseDto> {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      select: this.experienceSelect,
    });
    return ExperienceMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(experience, 'Experience', id),
    );
  }

  async create(
    createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    const { skillIds, ...data } = createExperienceDto;

    const experience = await this.prisma.$transaction(async (prisma) => {
      return prisma.experience.create({
        data: {
          ...data,
          skills: skillIds?.length
            ? {
                create: skillIds.map((skillId) => ({ skillId })),
              }
            : undefined,
        },
        select: this.experienceSelect,
      });
    });

    return ExperienceMapper.toResponseDto(experience);
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    const existing = await this.prisma.experience.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Experience', id);

    const { skillIds, ...data } = updateExperienceDto;

    const experience = await this.prisma.$transaction(async (prisma) => {
      if (skillIds !== undefined) {
        await prisma.experienceSkill.deleteMany({
          where: { experienceId: id },
        });
      }

      return prisma.experience.update({
        where: { id },
        data: {
          ...data,
          skills:
            skillIds !== undefined
              ? {
                  create: skillIds.map((skillId) => ({ skillId })),
                }
              : undefined,
        },
        select: this.experienceSelect,
      });
    });

    return ExperienceMapper.toResponseDto(experience);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.experience.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Experience', id);

    await this.prisma.experience.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.experience.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Experience', id);

    await this.prisma.experience.update(PrismaCrudUtil.restore(id));
  }
}
