import { PrismaCrudUtil } from './prisma-crud.util';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('PrismaCrudUtil', () => {
  describe('throwIfNotFound', () => {
    it('should throw NotFoundException if entity is null', () => {
      expect(() => PrismaCrudUtil.throwIfNotFound(null, 'User', '123')).toThrow(NotFoundException);
      expect(() => PrismaCrudUtil.throwIfNotFound(null, 'User', '123')).toThrow('User with ID 123 not found');
    });

    it('should return entity if not null', () => {
      const entity = { id: '1' };
      expect(PrismaCrudUtil.throwIfNotFound(entity, 'User', '1')).toBe(entity);
    });
  });

  describe('exists', () => {
    it('should return true if count > 0', async () => {
      const mockModel = { count: jest.fn().mockResolvedValue(1) };
      const result = await PrismaCrudUtil.exists(mockModel, { id: '1' });
      expect(result).toBe(true);
      expect(mockModel.count).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return false if count === 0', async () => {
      const mockModel = { count: jest.fn().mockResolvedValue(0) };
      const result = await PrismaCrudUtil.exists(mockModel, { id: '1' });
      expect(result).toBe(false);
    });
  });

  describe('throwIfDuplicate', () => {
    it('should throw ConflictException if entity exists', async () => {
      const mockModel = { count: jest.fn().mockResolvedValue(1) };
      await expect(PrismaCrudUtil.throwIfDuplicate(mockModel, { email: 'test@test.com' }, 'Email exists')).rejects.toThrow(ConflictException);
    });

    it('should not throw if entity does not exist', async () => {
      const mockModel = { count: jest.fn().mockResolvedValue(0) };
      await expect(PrismaCrudUtil.throwIfDuplicate(mockModel, { email: 'test@test.com' }, 'Email exists')).resolves.toBeUndefined();
    });
  });

  describe('paginate', () => {
    it('should return paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = PrismaCrudUtil.paginate(data, 100, 2, 10);

      expect(result).toEqual({
        data: [{ id: 1 }, { id: 2 }],
        meta: {
          total: 100,
          page: 2,
          limit: 10,
          totalPages: 10,
          hasNext: true,
          hasPrevious: true
        }
      });
    });
  });

  describe('softDelete', () => {
    it('should return update payload with deletedAt', () => {
      const result = PrismaCrudUtil.softDelete('1');
      expect(result).toEqual({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) }
      });
    });
  });

  describe('restore', () => {
    it('should return update payload with deletedAt null', () => {
      const result = PrismaCrudUtil.restore('1');
      expect(result).toEqual({
        where: { id: '1' },
        data: { deletedAt: null }
      });
    });
  });
});
