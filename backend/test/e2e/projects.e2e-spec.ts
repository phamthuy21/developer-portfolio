import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { setupTestDatabase, cleanupTestDatabase, teardownTestDatabase, getTestPrismaClient } from '../utils/database.util';
import { createTestUser, createTestProject } from '../fixtures';
import { getAuthHeaders, generateAdminToken } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();
  let adminUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    // Seed admin user
    const passwordHash = await bcrypt.hash('Password123!', 10);
    adminUser = await createTestUser(prisma, { passwordHash });

    // Seed some projects
    await createTestProject(prisma, { title: 'Project 1', slug: 'project-1', published: true, userId: adminUser.id });
    await createTestProject(prisma, { title: 'Project 2', slug: 'project-2', published: false, userId: adminUser.id });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/projects (GET) - Performance Smoke Test', async () => {
      const start = performance.now();
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .expect(200);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // Smoke test for fast response
      expect(response.body.data.length).toBe(1); // Only published
      expect(response.body.data[0].title).toBe('Project 1');
    });

    it('/api/v1/projects/:slug (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/projects/project-1')
        .expect(200);
      expect(response.body.title).toBe('Project 1');
    });

    it('/api/v1/projects/:slug (GET) - 404 for unpublished', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/projects/project-2')
        .expect(404);
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/projects (GET) - Requires Auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/projects')
        .expect(401);
    });

    it('/api/v1/admin/projects (GET) - Returns all projects', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/projects')
        .set(getAuthHeaders(generateAdminToken(adminUser.id)))
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('/api/v1/admin/projects (POST) - Validates payload', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/admin/projects')
        .set(getAuthHeaders(generateAdminToken(adminUser.id)))
        .send({ title: 'New' }) // Missing required fields
        .expect(400); // ValidationPipe transforms this to 400 Bad Request
    });

    it('/api/v1/admin/projects (POST) - Creates a project', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/projects')
        .set(getAuthHeaders(generateAdminToken(adminUser.id)))
        .send({
          title: 'New Project',
          slug: 'new-project',
          description: 'Desc',
          content: 'Content',
          published: true,
          featured: false,
        })
        .expect(201);

      expect(response.body.title).toBe('New Project');
    });
  });
});
