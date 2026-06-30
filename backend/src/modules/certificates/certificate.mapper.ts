import { CertificateResponseDto } from './dto/certificate.dto';
import { Certificate } from '@prisma/client';

export class CertificateMapper {
  static toResponseDto(
    certificate: Partial<Certificate>,
  ): CertificateResponseDto {
    const response = new CertificateResponseDto();
    response.id = certificate.id!;
    response.name = certificate.name!;
    response.issuer = certificate.issuer!;
    response.issueDate = certificate.issueDate!;
    response.credentialUrl = certificate.credentialUrl;
    response.imageUrl = certificate.imageUrl;
    response.createdAt = certificate.createdAt!;
    response.updatedAt = certificate.updatedAt!;
    return response;
  }
}
