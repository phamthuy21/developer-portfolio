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
Hi, I'm Pham Duc Thuy, a passionate Full-Stack Software Engineer with over 3 years of experience specializing in the OutSystems low-code platform. I focus on building scalable, high-performance, and secure enterprise web applications, primarily for Japanese clients across domains like Contract Management, GRC, HR, and Internal Operations.

### My Journey
My journey into software development started during my university years, driven by a passion for building impactful software. Over the past 3+ years, I’ve had the privilege of partnering with international clients to transform legacy systems into modern digital products, ensuring seamless system migrations and robust enterprise architectures.

### What I Do
I specialize in the OutSystems ecosystem (holding multiple certifications including Associate Reactive, ODC, Mobile, and Architecture Specialist). On the backend, I leverage .NET to build custom extensions for heavy data processing, integrate AWS S3, and configure enterprise security with SSO/SAML. I work extensively with relational databases such as Oracle, MySQL, and SQL Server.

### Outside of Coding
When I'm not coding, you can find me exploring new coffee shops, or reading about the latest trends in technology and design.
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
                    <span>Hanoi, Vietnam</span>
                  </li>
                  <li>
                    <strong className="block text-sm text-muted-foreground uppercase tracking-wider">Experience</strong>
                    <span>3+ Years</span>
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
