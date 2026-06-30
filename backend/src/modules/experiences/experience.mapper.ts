import {
  ExperienceResponseDto,
  ExperienceSkillDto,
} from './dto/experience.dto';
import { Experience, Skill } from '@prisma/client';

type ExperienceWithSkills = Partial<Experience> & {
  skills?: { skill: Partial<Skill> }[];
};

export class ExperienceMapper {
  static toResponseDto(
    experience: ExperienceWithSkills,
  ): ExperienceResponseDto {
    const response = new ExperienceResponseDto();
    response.id = experience.id!;
    response.company = experience.company!;
    response.position = experience.position!;
    response.location = experience.location;
    response.startDate = experience.startDate!;
    response.endDate = experience.endDate;
    response.current = experience.current!;
    response.description = experience.description!;
    response.createdAt = experience.createdAt!;
    response.updatedAt = experience.updatedAt!;

    response.skills =
      experience.skills?.map((es) => {
        const skillDto = new ExperienceSkillDto();
        skillDto.id = es.skill.id!;
        skillDto.name = es.skill.name!;
        skillDto.slug = es.skill.slug!;
        skillDto.iconUrl = es.skill.iconUrl;
        skillDto.category = es.skill.category!;
        return skillDto;
      }) || [];

    return response;
  }
}
