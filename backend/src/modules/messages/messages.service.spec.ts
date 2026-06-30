import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../../prisma/prisma.service';

type MockPrismaService = {
  message: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      message: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a message', async () => {
      const mockMessage = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
        subject: 'Hello',
        content: 'World',
      };
      prisma.message.create.mockResolvedValue(mockMessage);

      const result = await service.create({
        name: 'Test',
        email: 'test@example.com',
        subject: 'Hello',
        content: 'World',
      });
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });
  });

  describe('findAllAdmin', () => {
    it('should return paginated messages', async () => {
      const mockMessages = [{ id: '1', name: 'Test' }];
      prisma.message.count.mockResolvedValue(1);
      prisma.message.findMany.mockResolvedValue(mockMessages);

      const result = await service.findAllAdmin({ page: 1, limit: 10 });
      expect(result.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: '1' })]),
      );
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread messages count', async () => {
      prisma.message.count.mockResolvedValue(5);

      const result = await service.getUnreadCount();
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('findOneAdmin', () => {
    it('should return a message by id', async () => {
      const mockMessage = { id: '1', name: 'Test' };
      prisma.message.findUnique.mockResolvedValue(mockMessage);

      const result = await service.findOneAdmin('1');
      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });

    it('should throw if not found', async () => {
      prisma.message.findUnique.mockResolvedValue(null);
      await expect(service.findOneAdmin('unknown')).rejects.toThrow();
    });
  });

  describe('updateStatus', () => {
    it('should update message status', async () => {
      const mockMessage = { id: '1', name: 'Test' };
      prisma.message.findUnique.mockResolvedValue(mockMessage);
      prisma.message.update.mockResolvedValue({ ...mockMessage, isRead: true });

      const result = await service.updateStatus('1', { isRead: true });
      expect(result).toEqual(
        expect.objectContaining({ id: '1', isRead: true }),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a message', async () => {
      const mockMessage = { id: '1', name: 'Test' };
      prisma.message.findUnique.mockResolvedValue(mockMessage);
      prisma.message.update.mockResolvedValue(mockMessage);

      await service.remove('1');
      expect(prisma.message.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        }),
      );
    });
  });

  describe('restore', () => {
    it('should restore a message', async () => {
      const mockMessage = { id: '1', name: 'Test' };
      prisma.message.findUnique.mockResolvedValue(mockMessage);
      prisma.message.update.mockResolvedValue(mockMessage);

      await service.restore('1');
      expect(prisma.message.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: null }),
        }),
      );
    });
  });
});
