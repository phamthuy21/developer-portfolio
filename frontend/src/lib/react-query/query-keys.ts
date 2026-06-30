export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  ADMIN_DASHBOARD_STATS: ['admin', 'dashboard', 'stats'],
  ADMIN_PROJECTS: ['admin', 'projects'],
  ADMIN_BLOGS: ['admin', 'blogs'],
  ADMIN_SKILLS: ['admin', 'skills'],
  ADMIN_EXPERIENCES: ['admin', 'experiences'],
  ADMIN_CERTIFICATES: ['admin', 'certificates'],
  ADMIN_MESSAGES: ['admin', 'messages'],
  
  PROJECTS: {
    ALL: ['projects', 'all'],
    LIST: (params: Record<string, unknown> | undefined) => ['projects', 'list', params],
    DETAIL: (idOrSlug: string) => ['projects', 'detail', idOrSlug],
  },
  BLOGS: {
    ALL: ['blogs', 'all'],
    LIST: (params: Record<string, unknown> | undefined) => ['blogs', 'list', params],
    DETAIL: (idOrSlug: string) => ['blogs', 'detail', idOrSlug],
  },
  SKILLS: {
    ALL: ['skills', 'all'],
    DETAIL: (id: string) => ['skills', 'detail', id],
  },
  EXPERIENCES: {
    ALL: ['experiences', 'all'],
    DETAIL: (id: string) => ['experiences', 'detail', id],
  },
  CERTIFICATES: {
    ALL: ['certificates', 'all'],
    DETAIL: (id: string) => ['certificates', 'detail', id],
  },
  MESSAGES: {
    ALL: ['messages', 'all'],
    LIST: (params: Record<string, unknown> | undefined) => ['messages', 'list', params],
    DETAIL: (id: string) => ['messages', 'detail', id],
  }
} as const;
