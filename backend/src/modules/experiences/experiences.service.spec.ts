import { Test, TestingModule } from '@nestjs/testing';
import { ExperiencesService } from './experiences.service';
import { PrismaService } from '../../prisma/prisma.service';

type MockPrismaService = {
  experience: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  experienceSkill: {
    deleteMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('ExperiencesService', () => {
  let service: ExperiencesService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      experience: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      experienceSkill: {
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperiencesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
    prisma = module.get(PrismaService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active experiences', async () => {
      const mockExperiences = [{ id: '1', company: 'Test', skills: [] }];
      prisma.experience.findMany.mockResolvedValue(mockExperiences);

      const result = await service.findAll();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1' })]));
      expect(prisma.experience.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { deletedAt: null },
      }));
    });
  });

  describe('findAllAdmin', () => {
    it('should return all experiences including deleted', async () => {
      const mockExperiences = [{ id: '1', company: 'Test', skills: [] }];
      prisma.experience.findMany.mockResolvedValue(mockExperiences);

      const result = await service.findAllAdmin();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: '1' })]));
    });
  });

  describe('findOneAdmin', () => {
    it('should return an experience by id', async () => {
      const mockExperience = { id: '1', company: 'Test', skills: [] };
      prisma.experience.findUnique.mockResolvedValue(mockExperience);

      const result = await service.findOneAdmin('1');
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });

    it('should throw if not found', async () => {
      prisma.experience.findUnique.mockResolvedValue(null);
      await expect(service.findOneAdmin('unknown')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create an experience', async () => {
      const mockExperience = { id: '1', company: 'Test', skills: [] };
      prisma.experience.create.mockResolvedValue(mockExperience);

      const result = await service.create({ company: 'Test', position: 'Dev', location: 'Remote', startDate: '2023-01-01T00:00:00.000Z', current: true, description: 'Desc', skillIds: [] });
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });
  });

  describe('update', () => {
    it('should update an experience', async () => {
      const mockExperience = { id: '1', company: 'Test', skills: [] };
      prisma.experience.findUnique.mockResolvedValue(mockExperience);
      prisma.experience.update.mockResolvedValue({ ...mockExperience, company: 'Updated' });

      const result = await service.update('1', { company: 'Updated' });
      expect(result).toEqual(expect.objectContaining({ id: '1', company: 'Updated' }));
    });
  });

  describe('remove', () => {
    it('should soft delete an experience', async () => {
      const mockExperience = { id: '1', company: 'Test', skills: [] };
      prisma.experience.findUnique.mockResolvedValue(mockExperience);
      prisma.experience.update.mockResolvedValue(mockExperience);

      await service.remove('1');
      expect(prisma.experience.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }));
    });
  });

  describe('restore', () => {
    it('should restore an experience', async () => {
      const mockExperience = { id: '1', company: 'Test', skills: [] };
      prisma.experience.findUnique.mockResolvedValue(mockExperience);
      prisma.experience.update.mockResolvedValue(mockExperience);

      await service.restore('1');
      expect(prisma.experience.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: null }),
      }));
    });
  });
});
