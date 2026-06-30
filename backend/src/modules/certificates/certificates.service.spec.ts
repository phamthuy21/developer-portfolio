import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { PrismaService } from '../../prisma/prisma.service';

type MockPrismaService = {
  certificate: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('CertificatesService', () => {
  let service: CertificatesService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      certificate: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    prisma = module.get(PrismaService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all certificates', async () => {
      const mockCertificates = [{ id: '1', name: 'Test Cert' }];
      prisma.certificate.findMany.mockResolvedValue(mockCertificates);

      const result = await service.findAll();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1' })]));
    });
  });

  describe('findAllAdmin', () => {
    it('should return all certificates', async () => {
      const mockCertificates = [{ id: '1', name: 'Test Cert' }];
      prisma.certificate.findMany.mockResolvedValue(mockCertificates);

      const result = await service.findAllAdmin();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1' })]));
    });
  });

  describe('findOneAdmin', () => {
    it('should return a certificate by id', async () => {
      const mockCertificate = { id: '1', name: 'Test Cert' };
      prisma.certificate.findUnique.mockResolvedValue(mockCertificate);

      const result = await service.findOneAdmin('1');
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });

    it('should throw if not found', async () => {
      prisma.certificate.findUnique.mockResolvedValue(null);
      await expect(service.findOneAdmin('unknown')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a certificate', async () => {
      const mockCertificate = { id: '1', name: 'Test Cert' };
      prisma.certificate.create.mockResolvedValue(mockCertificate);

      const result = await service.create({ name: 'Test Cert', issuer: 'Issuer', issueDate: '2023-01-01T00:00:00.000Z' });
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });
  });

  describe('update', () => {
    it('should update a certificate', async () => {
      const mockCertificate = { id: '1', name: 'Test Cert' };
      prisma.certificate.findUnique.mockResolvedValue(mockCertificate);
      prisma.certificate.update.mockResolvedValue({ ...mockCertificate, name: 'Updated' });

      const result = await service.update('1', { name: 'Updated' });
      expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Updated' }));
    });
  });

  describe('remove', () => {
    it('should soft delete a certificate', async () => {
      const mockCertificate = { id: '1', name: 'Test Cert' };
      prisma.certificate.findUnique.mockResolvedValue(mockCertificate);
      prisma.certificate.update.mockResolvedValue(mockCertificate);

      await service.remove('1');
      expect(prisma.certificate.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }));
    });
  });

  describe('restore', () => {
    it('should restore a certificate', async () => {
      const mockCertificate = { id: '1', name: 'Test Cert' };
      prisma.certificate.findUnique.mockResolvedValue(mockCertificate);
      prisma.certificate.update.mockResolvedValue(mockCertificate);

      await service.restore('1');
      expect(prisma.certificate.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: null }),
      }));
    });
  });
});
