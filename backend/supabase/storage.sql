-- Supabase Storage Configuration Script
-- Ensure you run this on the Supabase SQL Editor.

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, '{image/jpeg,image/png}'),
  ('project-images', 'project-images', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('blog-images', 'blog-images', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('certificates', 'certificates', true, 10485760, '{image/jpeg,image/png,application/pdf}'),
  ('resume', 'resume', true, 10485760, '{application/pdf}'),
  ('assets', 'assets', true, 2097152, '{image/svg+xml,image/png}')
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Apply Public Read Access to Buckets
CREATE POLICY "Public Access for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Access for project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public Access for blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public Access for certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Public Access for resume" ON storage.objects FOR SELECT USING (bucket_id = 'resume');
CREATE POLICY "Public Access for assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
