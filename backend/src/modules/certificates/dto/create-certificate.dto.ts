import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({ description: 'The name of the certificate' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Issuing organization' })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({ description: 'Date of issue in ISO format' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiPropertyOptional({ description: 'URL to the credential' })
  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
