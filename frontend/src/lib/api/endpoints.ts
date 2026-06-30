export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  ADMIN: {
    PROJECTS: '/admin/projects',
    BLOGS: '/admin/blogs',
    SKILLS: '/admin/skills',
    EXPERIENCES: '/admin/experiences',
    CERTIFICATES: '/admin/certificates',
    MESSAGES: '/admin/messages',
  },
  PUBLIC: {
    PROJECTS: '/projects',
    BLOGS: '/blogs',
    SKILLS: '/skills',
    EXPERIENCES: '/experiences',
    CERTIFICATES: '/certificates',
    MESSAGES: '/messages',
  }
} as const;
