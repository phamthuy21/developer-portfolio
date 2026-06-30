# 1. Project Overview

- **Name**: IT Developer Portfolio
- **Vision**: To provide a premium, modern, and high-performance digital presence for an IT professional.
- **Purpose**: Showcase projects, experience, skills, and technical thoughts via a blog in a professional and accessible manner.
- **Target Audience**: Recruiters, hiring managers, potential clients, and fellow developers.
- **Expected User Experience**: Fast, responsive, visually stunning, accessible, and intuitive to navigate across all devices.

# 2. Project Goals

- Build a premium portfolio website.
- Showcase projects professionally.
- Provide a secure admin dashboard for content management.
- Maintain scalability and high performance.
- Follow a production-ready architecture and best practices.

# 3. Out of Scope

The following features are intentionally excluded from this project:

- E-commerce and payments
- Social networking features (user profiles, comments)
- Multi-tenant support
- Native mobile application development

# 4. Tech Stack

**Frontend**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- TanStack Query
- React Hook Form
- Zod

**Backend**
- NestJS
- Prisma
- JWT
- Swagger

**Database**
- Supabase PostgreSQL
- Supabase Storage
- Supabase Auth
- Row Level Security (RLS)

**Deployment**
- Vercel (Frontend)
- Railway (Backend)
- Docker
- GitHub Actions (CI/CD)

# 5. Project Architecture

The project employs a clear separation of concerns with a decoupled frontend and backend.

- **Frontend / Backend Separation**: Independent scaling and deployment.
- **Feature-Based Architecture**: Code organized by domain features rather than technical types.
- **Repository Pattern**: Abstracted data access on the backend.
- **REST API**: Standardized communication between client and server.
- **Environment Variables**: Secure configuration management.
- **Modular Design**: Loosely coupled components and modules.

*For detailed information, refer to the detailed architecture documentation.*

# 6. Core Features

**Public Website**
- Home
- About
- Skills
- Experience
- Projects
- Certificate
- Blog
- Contact

**Admin**
- Authentication
- Dashboard
- Project Management
- Blog Management
- Skill Management
- Experience Management
- Certificate Management
- Message Management

# 7. Coding Philosophy

Our development principles ensure high quality and maintainability:

- **Clean Architecture**: Separation of concerns and isolated domain logic.
- **SOLID**: Object-oriented design principles.
- **DRY**: Don't Repeat Yourself.
- **KISS**: Keep It Simple, Stupid.
- **Repository Pattern**: Data layer abstraction.
- **Feature-First Organization**: Grouping code by business feature.
- **Type Safety**: Strict TypeScript compilation.
- **Accessibility First**: ARIA standards and semantic HTML.

# 8. Project Standards

Strict standards dictate our workflow and code quality. Refer to the following documents for specifics:

- [CODING_STANDARD](CODING_STANDARD.md)
- [UI_GUIDELINE](UI_GUIDELINE.md)
- [COMPONENT_GUIDELINE](COMPONENT_GUIDELINE.md)
- [ROADMAP](ROADMAP.md)
- [PHASES](PHASES.md)
- [DECISIONS](DECISIONS.md)

# 9. AI Development Workflow

AI agents contributing to this project MUST adhere to this workflow:

- Read `PROJECT.md` first.
- Read `../.agents/AGENTS.md`.
- Read relevant Skills from `../.agents/skills/`.
- Read related documentation in `/docs`.
- Never skip phases.
- Never generate duplicate code.
- Stop after every phase.
- Generate a phase report.
- Wait for the user's CONFIRM before continuing.

# 10. Definition of Done

A feature is considered complete only when:

- Architecture is respected and followed.
- Code follows all documented project standards.
- Build succeeds without errors.
- Lint passes without warnings.
- Types pass strict type checking.
- Documentation is updated to reflect changes.
- Phase report is generated.
- User confirms completion.

# 11. Future Expansion

Planned capabilities for future iterations:

- Multi-language support (i18n)
- CMS integration
- AI chatbot for interactive resume
- Visitor analytics
- Resume generator (PDF export)
- Dark/Light theme switcher
- Email notifications
- Blog search functionality
- Portfolio analytics
