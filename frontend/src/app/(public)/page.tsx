import { Metadata } from 'next';
import { HeroSection } from '@/features/public/home/components/HeroSection';
import { FeaturedProjects } from '@/features/public/home/components/FeaturedProjects';
import { LatestBlogs } from '@/features/public/home/components/LatestBlogs';
import { SkillsSection } from '@/features/public/home/components/SkillsSection';
import { getPublicProjects } from '@/features/public/projects/api/get-public-projects';
import { getPublicBlogs } from '@/features/public/blogs/api/get-public-blogs';
import { getPublicSkills } from '@/features/public/skills/api/get-public-skills';

// ISR Configuration: Revalidate this page every 1 hour
export const revalidate = 3600;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pham Duc Thuy',
  jobTitle: 'Full-Stack Developer',
  url: 'https://portfolio.example.com',
  sameAs: [
    'https://github.com/phamthuy21',
    'https://www.linkedin.com/in/pdt21/',
  ],
};

export const metadata: Metadata = {
  title: 'Portfolio | Full-Stack Developer',
  description: 'Full-stack developer specializing in scalable web applications, React, Next.js, and Node.js.',
  openGraph: {
    title: 'Portfolio | Full-Stack Developer',
    description: 'Full-stack developer specializing in scalable web applications, React, Next.js, and Node.js.',
    type: 'website',
  },
  other: {
    'script:ld+json': JSON.stringify(personJsonLd),
  },
};

export default async function HomePage() {
  // Fetch data in parallel
  const [projectsResponse, blogsResponse, skills] = await Promise.all([
    getPublicProjects({ limit: 3, featured: true }).catch(() => ({ data: [], meta: { total: 0 } })),
    getPublicBlogs({ limit: 3 }).catch(() => ({ data: [], meta: { total: 0 } })),
    getPublicSkills().catch(() => []),
  ]);

  const projects = projectsResponse?.data || [];
  const blogs = blogsResponse?.data || [];

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={projects} />
      <SkillsSection skillsGroups={skills} />
      <LatestBlogs blogs={blogs} />
    </>
  );
}
