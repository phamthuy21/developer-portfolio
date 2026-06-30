import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { setupTestDatabase, cleanupTestDatabase, teardownTestDatabase, getTestPrismaClient } from '../utils/database.util';
import { createTestUser, createTestBlog } from '../fixtures';
import { getAuthHeaders, generateAdminToken } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('BlogsController (e2e)', () => {
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

    // Seed some blogs
    await createTestBlog(prisma, { title: 'Blog 1', slug: 'blog-1', published: true, userId: adminUser.id });
    await createTestBlog(prisma, { title: 'Blog 2', slug: 'blog-2', published: false, userId: adminUser.id });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/blogs (GET) - Performance Smoke Test', async () => {
      const start = performance.now();
      const response = await request(app.getHttpServer())
        .get('/api/v1/blogs')
        .expect(200);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // Smoke test for fast response
      expect(response.body.data.length).toBe(1); // Only published
      expect(response.body.data[0].title).toBe('Blog 1');
    });

    it('/api/v1/blogs/:slug (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/blogs/blog-1')
        .expect(200);
      expect(response.body.title).toBe('Blog 1');
    });

    it('/api/v1/blogs/:slug (GET) - 404 for unpublished', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/blogs/blog-2')
        .expect(404);
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/blogs (GET) - Requires Auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/blogs')
        .expect(401);
    });

    it('/api/v1/admin/blogs (GET) - Returns all blogs', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/blogs')
        .set(getAuthHeaders(generateAdminToken(adminUser.id)))
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('/api/v1/admin/blogs (POST) - Creates a blog', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/blogs')
        .set(getAuthHeaders(generateAdminToken(adminUser.id)))
        .send({
          title: 'New Blog',
          slug: 'new-blog',
          excerpt: 'Desc',
          content: 'Content',
          published: true,
          featured: false,
        })
        .expect(201);

      expect(response.body.title).toBe('New Blog');
    });
  });
});
