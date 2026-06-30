import { PrismaClient } from '@prisma/client';

export const createTestUser = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: 'hashedpassword',
      fullName: 'Admin User',
      ...overrides,
    },
  });
};

export const createTestProject = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.project.create({
    data: {
      title: 'Project 1',
      slug: 'project-1',
      description: 'Test description',
      content: 'Test content',
      published: true,
      featured: false,
      ...overrides,
    },
  });
};

export const createTestBlog = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.blog.create({
    data: {
      title: 'Blog 1',
      slug: 'blog-1',
      excerpt: 'Test excerpt',
      content: 'Test content',
      published: true,
      ...overrides,
    },
  });
};

export const createTestSkill = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.skill.create({
    data: {
      name: 'Test Skill',
      slug: 'test-skill',
      category: 'Frontend',
      ...overrides,
    },
  });
};

export const createTestExperience = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.experience.create({
    data: {
      position: 'Test Position',
      company: 'Test Company',
      startDate: new Date(),
      description: 'Test description',
      ...overrides,
    },
  });
};

export const createTestCertificate = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.certificate.create({
    data: {
      name: 'Test Certificate',
      issuer: 'Test Issuer',
      issueDate: new Date(),
      ...overrides,
    },
  });
};

export const createTestMessage = async (prisma: PrismaClient, overrides: any = {}) => {
  return prisma.message.create({
    data: {
      name: 'Test User',
      email: 'user@test.com',
      subject: 'Test Subject',
      content: 'Test message content',
      isRead: false,
      ...overrides,
    },
  });
};
