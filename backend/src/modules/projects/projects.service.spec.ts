import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../prisma/prisma.service';

type MockPrismaService = {
  project: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      project: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get(PrismaService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return published projects', async () => {
      const mockProjects = [{ id: '1', title: 'Test', skills: [] }];
      prisma.project.count.mockResolvedValue(1);
      prisma.project.findMany.mockResolvedValue(mockProjects as any);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([{
        id: '1', title: 'Test', skills: []
      }]);
      expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ published: true, deletedAt: null }),
      }));
    });
  });

  describe('findBySlug', () => {
    it('should return a published project by slug', async () => {
      const mockProject = { id: '1', slug: 'test', published: true, skills: [] };
      prisma.project.findFirst.mockResolvedValue(mockProject as any);

      const result = await service.findBySlug('test');
      expect(result).toEqual(expect.objectContaining({ id: '1', slug: 'test', skills: [] }));
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.project.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('unknown')).rejects.toThrow('Project with slug unknown not found');
    });
  });

});
