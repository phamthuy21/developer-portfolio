# Supabase Authentication Production Guide

## 1. Authentication Providers
The project uses the NestJS backend for authentication (JWT), but if using Supabase Auth (e.g. for Admin UI), ensure:
- **Email Auth**: Enabled.
- **Confirm Email**: Required for production to prevent spam accounts.
- **Magic Link**: Disabled unless specifically needed.
- **Social Providers**: Disabled (unless requested in the future).

## 2. SMTP Configuration
For production, the default Supabase email server is rate-limited and not recommended.
- **Provider**: Configure a custom SMTP provider (e.g., Resend, SendGrid, Amazon SES).
- **Settings**:
  - `Host`: smtp.resend.com (example)
  - `Port`: 465
  - `User/Password`: Derived from provider.
  - `Sender Email`: admin@yourdomain.com

## 3. Password Policies
- Enable **Strong Passwords**: At least 8 characters, requiring uppercase, lowercase, numbers, and special characters.

## 4. Sessions & JWTs
- **JWT Expiration**: Ensure the Supabase JWT expiration matches your NestJS backend JWT strategy (e.g., 3600 seconds / 1 hour).
- **JWT Secret**: Your NestJS `JWT_SECRET` must be kept perfectly secure. If NestJS uses the Supabase Auth JWT, the secrets must match. (Currently, the project uses a custom NestJS JWT implementation, so Supabase Auth settings are only relevant if Supabase is used directly).
- **Refresh Tokens**: Enable refresh token rotation and set absolute expiration.

## 5. Site URL and Redirects
- **Site URL**: `https://your-production-domain.com`
- **Allowed Callback URLs**: 
  - `https://your-production-domain.com/auth/callback`
  - `https://your-production-domain.com/admin/login`

## 6. Anonymous Access Audit
- Supabase anonymous sign-ins should be **disabled**. Only allow authenticated admins to interact with the backend API or direct Supabase resources.

## 7. Verification Checklist
- [ ] Custom SMTP is verified and sending emails correctly.
- [ ] User registration requires email confirmation.
- [ ] Admin login issues JWTs that the NestJS backend can verify (or NestJS completely handles its own auth).
- [ ] Anonymous sign-in is disabled.
