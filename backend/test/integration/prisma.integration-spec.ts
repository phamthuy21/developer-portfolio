import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { setupTestDatabase, cleanupTestDatabase, teardownTestDatabase } from '../utils/database.util';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaCrudUtil } from '../../src/common/utils/prisma-crud.util';

describe('Prisma Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    await setupTestDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Transactions', () => {
    it('should successfully commit a transaction', async () => {
      const result = await prisma.$transaction(async (tx) => {
        const skill1 = await tx.skill.create({
          data: { name: 'Tx Skill 1', slug: 'tx-skill-1', category: 'Backend' },
        });
        const skill2 = await tx.skill.create({
          data: { name: 'Tx Skill 2', slug: 'tx-skill-2', category: 'Backend' },
        });
        return [skill1, skill2];
      });

      expect(result.length).toBe(2);
      const count = await prisma.skill.count();
      expect(count).toBe(2);
    });

    it('should rollback transaction on error', async () => {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.skill.create({
            data: { name: 'Tx Skill 3', slug: 'tx-skill-3', category: 'Backend' },
          });
          throw new Error('Force rollback');
        });
      } catch (e) {
        // Expected error
      }

      const count = await prisma.skill.count();
      expect(count).toBe(0);
    });
  });

  describe('Soft Deletes', () => {
    it('should set deletedAt and filter out deleted records', async () => {
      const skill = await prisma.skill.create({
        data: { name: 'Soft Delete Skill', slug: 'sd-skill', category: 'Backend' },
      });

      // Soft delete
      await prisma.skill.update({
        where: { id: skill.id },
        ...PrismaCrudUtil.softDelete(skill.id),
      });

      // Assert deletedAt is set
      const deletedSkill = await prisma.skill.findUnique({
        where: { id: skill.id },
      });
      expect(deletedSkill?.deletedAt).not.toBeNull();

      // Assert normal queries filter it out if we query where deletedAt: null
      const activeCount = await prisma.skill.count({
        where: { deletedAt: null },
      });
      expect(activeCount).toBe(0);
    });

    it('should restore a soft deleted record', async () => {
      const skill = await prisma.skill.create({
        data: { name: 'Restore Skill', slug: 'rs-skill', category: 'Backend', deletedAt: new Date() },
      });

      // Restore
      await prisma.skill.update({
        where: { id: skill.id },
        ...PrismaCrudUtil.restore(skill.id),
      });

      const restoredSkill = await prisma.skill.findUnique({
        where: { id: skill.id },
      });
      expect(restoredSkill?.deletedAt).toBeNull();
    });
  });
});
