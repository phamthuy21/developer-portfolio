import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExperienceSkillDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  iconUrl?: string | null;

  @ApiProperty()
  category: string;
}

export class ExperienceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  position: string;

  @ApiPropertyOptional()
  location?: string | null;

  @ApiProperty()
  startDate: Date;

  @ApiPropertyOptional()
  endDate?: Date | null;

  @ApiProperty()
  current: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [ExperienceSkillDto] })
  skills: ExperienceSkillDto[];
}
