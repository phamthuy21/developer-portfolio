import { ProjectResponseDto, ProjectSkillDto } from './dto/project.dto';
import { Project, Skill } from '@prisma/client';

type ProjectWithSkills = Partial<Project> & {
  skills?: { skill: Partial<Skill> }[];
};

export class ProjectMapper {
  static toResponseDto(project: ProjectWithSkills): ProjectResponseDto {
    const response = new ProjectResponseDto();
    response.id = project.id!;
    response.title = project.title!;
    response.slug = project.slug!;
    response.description = project.description!;
    response.content = project.content!;
    response.githubUrl = project.githubUrl;
    response.liveUrl = project.liveUrl;
    response.imageUrl = project.imageUrl;
    response.featured = project.featured!;
    response.createdAt = project.createdAt!;
    response.updatedAt = project.updatedAt!;

    response.skills =
      project.skills?.map((ps) => {
        const skillDto = new ProjectSkillDto();
        skillDto.id = ps.skill.id!;
        skillDto.name = ps.skill.name!;
        skillDto.slug = ps.skill.slug!;
        skillDto.iconUrl = ps.skill.iconUrl;
        skillDto.category = ps.skill.category!;
        return skillDto;
      }) || [];

    return response;
  }
}
