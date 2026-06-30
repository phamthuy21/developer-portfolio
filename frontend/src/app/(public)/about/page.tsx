import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicSkills } from '@/features/public/skills/api/get-public-skills';
import { SkillsSection } from '@/features/public/home/components/SkillsSection';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About | Developer Portfolio',
  description: 'Learn more about my background, skills, and experience as a full-stack developer.',
};

const BIO_CONTENT = `
Hi, I'm a passionate full-stack developer focused on building scalable, performant, and accessible web applications. I enjoy turning complex problems into simple, beautiful, and intuitive designs.

### My Journey
My journey into software development started a few years ago when I decided to build a website for a local business. Since then, I've had the privilege of working with various startups and established companies, helping them build digital products that make a difference.

### What I Do
I specialize in the React ecosystem (Next.js, React, React Native) for the frontend, and Node.js (NestJS, Express) for the backend. I have strong experience working with relational databases (PostgreSQL, MySQL) and NoSQL databases (MongoDB, Redis). I also care deeply about UI/UX and spend time crafting experiences using tools like Tailwind CSS and Framer Motion.

### Outside of Coding
When I'm not coding, you can find me exploring new coffee shops, hiking, or reading about the latest trends in technology and design.
`;

export default async function AboutPage() {
  const skills = await getPublicSkills().catch(() => []);

  return (
    <>
      <PageHero 
        title="About Me" 
        description="A little bit about my background, what I do, and what drives me."
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <AnimatedReveal>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <MarkdownRenderer content={BIO_CONTENT} />
              </div>
            </AnimatedReveal>
          </div>
          
          <div className="md:col-span-4">
            <AnimatedReveal delay={0.2} direction="left">
              <div className="rounded-2xl border bg-muted/30 p-8">
                <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                <ul className="space-y-4">
                  <li>
                    <strong className="block text-sm text-muted-foreground uppercase tracking-wider">Location</strong>
                    <span>San Francisco, CA</span>
                  </li>
                  <li>
                    <strong className="block text-sm text-muted-foreground uppercase tracking-wider">Experience</strong>
                    <span>5+ Years</span>
                  </li>
                  <li>
                    <strong className="block text-sm text-muted-foreground uppercase tracking-wider">Availability</strong>
                    <span>Open to opportunities</span>
                  </li>
                </ul>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </Section>

      <SkillsSection skillsGroups={skills} />
    </>
  );
}
