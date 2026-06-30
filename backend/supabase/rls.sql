-- Row Level Security Configuration Script
-- Note: Admin access and actual logic will be managed via service roles in the backend.

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experience_skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certificates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;

-- 1. Anonymous / Public access policies
-- Public Read Access
CREATE POLICY "Public Read Projects" ON "projects" FOR SELECT USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Blogs" ON "blogs" FOR SELECT USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Skills" ON "skills" FOR SELECT USING (true);
CREATE POLICY "Public Read ProjectSkills" ON "project_skills" FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON "experiences" FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public Read ExperienceSkills" ON "experience_skills" FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON "certificates" FOR SELECT USING (true);

-- Anonymous Insert Access
CREATE POLICY "Anon Insert Messages" ON "messages" FOR INSERT WITH CHECK (true);

-- No explicit policies for Admin needed if the NestJS backend uses the Supabase service_role key to bypass RLS,
-- or if using standard PostgreSQL connection strings, Prisma operates as a superuser by default.
