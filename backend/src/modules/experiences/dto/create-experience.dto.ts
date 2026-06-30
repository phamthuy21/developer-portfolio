import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ description: 'Job position/title' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiPropertyOptional({ description: 'Location (e.g., Remote, City)' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Start date in ISO format' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ description: 'End date in ISO format' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiProperty({ description: 'Description of the role' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Array of associated Skill IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds?: string[];
}
