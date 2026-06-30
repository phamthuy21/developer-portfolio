import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CertificateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  issuer: string;

  @ApiProperty()
  issueDate: Date;

  @ApiPropertyOptional()
  credentialUrl?: string | null;

  @ApiPropertyOptional()
  imageUrl?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
