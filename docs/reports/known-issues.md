# Known Issues & Future Enhancements

**Date:** 2026-07-01

## Known Non-Critical Issues
The system has been stabilized and verified for production. No critical or high-severity issues remain. The following are minor architectural notes or non-blocking enhancements identified during QA.

### 1. Browser Subagent & Playwright Testing
- **Description:** Attempting to execute fully automated UI clicking loops using external AI browser subagents can encounter OS-level access errors on specific local environments.
- **Impact:** Low. Core API and Next.js SSR logic is structurally tested using NestJS E2E Test Suites and the Vercel Turbopack compiler.
- **Mitigation:** Rely on deterministic testing frameworks (e.g., Cypress or Playwright local instances) for CI/CD automation rather than AI-driven visual testing.

### 2. Rate Limiting on Public Contact Form
- **Description:** The `POST /api/v1/messages` endpoint does not currently implement strict rate limiting via `@nestjs/throttler`.
- **Impact:** Low-Medium. Potential for spam if the portfolio endpoint is discovered by automated bots.
- **Mitigation:** Future phase should implement a global rate limit or integrate reCAPTCHA/Turnstile for form submissions.

### 3. Image Optimization
- **Description:** User uploads (thumbnails, avatar) rely on basic file storage paths. They do not currently route through a dedicated CDN (e.g., Cloudinary or Supabase Storage image transformations).
- **Impact:** Low. 
- **Mitigation:** Integrate Next.js `next/image` with remote URL whitelisting in `next.config.ts` for automated WebP compression once Supabase Storage is configured in Production.
