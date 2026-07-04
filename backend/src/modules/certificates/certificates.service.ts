import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CertificateResponseDto } from './dto/certificate.dto';
import { CertificateMapper } from './certificate.mapper';
import { Prisma } from '@prisma/client';
import { PrismaCrudUtil } from '../../common/utils/prisma-crud.util';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly certificateSelect = {
    id: true,
    name: true,
    issuer: true,
    issueDate: true,
    credentialUrl: true,
    imageUrl: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  } satisfies Prisma.CertificateSelect;

  async findAll(): Promise<CertificateResponseDto[]> {
    const certificates = await this.prisma.certificate.findMany({
      where: { deletedAt: null },
      select: this.certificateSelect,
      orderBy: {
        issueDate: 'desc',
      },
    });

    return certificates.map((c) => CertificateMapper.toResponseDto(c));
  }

  // --- Admin Methods ---

  async findAllAdmin(): Promise<CertificateResponseDto[]> {
    const certificates = await this.prisma.certificate.findMany({
      select: this.certificateSelect,
      orderBy: { issueDate: 'desc' },
    });
    return certificates.map((c) => CertificateMapper.toResponseDto(c));
  }

  async findOneAdmin(id: string): Promise<CertificateResponseDto> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      select: this.certificateSelect,
    });
    return CertificateMapper.toResponseDto(
      PrismaCrudUtil.throwIfNotFound(certificate, 'Certificate', id),
    );
  }

  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateResponseDto> {
    const certificate = await this.prisma.certificate.create({
      data: createCertificateDto,
      select: this.certificateSelect,
    });
    return CertificateMapper.toResponseDto(certificate);
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<CertificateResponseDto> {
    const existing = await this.prisma.certificate.findUnique({
      where: { id },
    });
    PrismaCrudUtil.throwIfNotFound(existing, 'Certificate', id);

    const certificate = await this.prisma.certificate.update({
      where: { id },
      data: updateCertificateDto,
      select: this.certificateSelect,
    });

    return CertificateMapper.toResponseDto(certificate);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.certificate.findUnique({
      where: { id },
    });
    PrismaCrudUtil.throwIfNotFound(existing, 'Certificate', id);

    await this.prisma.certificate.update(PrismaCrudUtil.softDelete(id));
  }

  async restore(id: string): Promise<void> {
    const existing = await this.prisma.certificate.findUnique({
      where: { id },
    });
    PrismaCrudUtil.throwIfNotFound(existing, 'Certificate', id);

    await this.prisma.certificate.update(PrismaCrudUtil.restore(id));
  }
}
