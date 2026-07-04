import { SkillResponseDto } from './dto/skill.dto';
import { Skill } from '@prisma/client';

export class SkillMapper {
  static toResponseDto(skill: Partial<Skill>): SkillResponseDto {
    const response = new SkillResponseDto();
    response.id = skill.id!;
    response.name = skill.name!;
    response.slug = skill.slug!;
    response.iconUrl = skill.iconUrl;
    response.category = skill.category!;
    response.createdAt = skill.createdAt!;
    response.updatedAt = skill.updatedAt!;
    response.deletedAt = skill.deletedAt;
    return response;
  }
}
