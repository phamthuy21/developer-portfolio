import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SkillResponseDto } from './dto/skill.dto';
import { SkillMapper } from './skill.mapper';
import { Prisma } from '@prisma/client';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly skillSelect = {
    id: true,
    name: true,
    slug: true,
    iconUrl: true,
    category: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  } satisfies Prisma.SkillSelect;

  async findAll(): Promise<Record<string, SkillResponseDto[]>> {
    const skills = await this.prisma.skill.findMany({
      select: this.skillSelect,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    const mappedSkills = skills.map((s) => SkillMapper.toResponseDto(s));

    return mappedSkills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, SkillResponseDto[]>,
    );
  }

  // --- Admin Methods ---

  async findAllAdmin(): Promise<SkillResponseDto[]> {
    const skills = await this.prisma.skill.findMany({
      select: this.skillSelect,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return skills.map((s) => SkillMapper.toResponseDto(s));
  }

  async findOneAdmin(id: string): Promise<SkillResponseDto> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      select: this.skillSelect,
    });
    return SkillMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(skill, 'Skill', id),
    );
  }

  async create(createSkillDto: CreateSkillDto): Promise<SkillResponseDto> {
    const slug =
      createSkillDto.slug ||
      createSkillDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    await PrismaCrudUtil.throwIfDuplicate(
      this.prisma.skill,
      { OR: [{ slug }, { name: createSkillDto.name }] },
      `Skill with this name or slug already exists`,
    );

    const skill = await this.prisma.skill.create({
      data: { ...createSkillDto, slug },
      select: this.skillSelect,
    });

    return SkillMapper.toResponseDto(skill);
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    const existing = await this.prisma.skill.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Skill', id);

    let slug = updateSkillDto.slug;
    if (!slug && updateSkillDto.name) {
      slug = updateSkillDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (
      (slug && slug !== existing!.slug) ||
      (updateSkillDto.name && updateSkillDto.name !== existing!.name)
    ) {
      await PrismaCrudUtil.throwIfDuplicate(
        this.prisma.skill,
        {
          OR: [{ slug: slug || '' }, { name: updateSkillDto.name || '' }],
        },
        `Skill with this name or slug already exists`,
      );
    }

    const skill = await this.prisma.skill.update({
      where: { id },
      data: { ...updateSkillDto, ...(slug && { slug }) },
      select: this.skillSelect,
    });

    return SkillMapper.toResponseDto(skill);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.skill.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Skill', id);

    await this.prisma.skill.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.skill.findUnique({ where: { id } });
    PrismaCrudUtil.throwIfNotFound(existing, 'Skill', id);

    await this.prisma.skill.update(PrismaCrudUtil.restore(id));
  }
}
