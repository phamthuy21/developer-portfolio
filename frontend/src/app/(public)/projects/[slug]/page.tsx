import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicProjectBySlug, getPublicProjects } from '@/features/public/projects/api/get-public-projects';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { TechnologyBadge } from '@/components/public/TechnologyBadge';
import { ArrowLeft, ExternalLink, Code } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export const revalidate = 300;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const response = await getPublicProjects({ limit: 100 });
    return (response?.data || []).map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const params = await props.params;
  try {
    const project = await getPublicProjectBySlug(params.slug);
    if (!project) return { title: 'Project Not Found' };

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: `https://portfolio.example.com/projects/${project.slug}`,
      image: project.thumbnail,
      author: {
        '@type': 'Person',
        name: 'Developer Name',
      },
    };

    return {
      title: `${project.title} | Projects`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.thumbnail ? [{ url: project.thumbnail }] : [],
      },
      other: {
        'script:ld+json': JSON.stringify(jsonLd),
      },
    };
  } catch {
    return { title: 'Project Not Found' };
  }
}

import { Project } from '@/features/admin/projects/types';

export default async function ProjectDetailPage(props: ProjectPageProps) {
  const params = await props.params;
  let project: Project | null = null;
  try {
    project = await getPublicProjectBySlug(params.slug);
  } catch {
    // handled by !project below
  }

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-24 pb-16">
      <Container>
        <AnimatedReveal>
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="flex gap-4">
              {project.repositoryUrl && (
                <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
                  <Code className="mr-2 h-4 w-4" /> Source
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "default" })}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Visit Live
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {project.technologies.map((tag: string) => (
              <TechnologyBadge key={tag} name={tag} variant="secondary" />
            ))}
          </div>
        </AnimatedReveal>
      </Container>

      {project.thumbnail && (
        <AnimatedReveal delay={0.2} direction="none">
          <Container className="mb-16">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="object-cover w-full h-full"
              />
            </div>
          </Container>
        </AnimatedReveal>
      )}

      <Section className="pt-0">
        <Container className="max-w-4xl">
          <AnimatedReveal delay={0.3}>
            <MarkdownRenderer content={project.content} />
          </AnimatedReveal>
        </Container>
      </Section>
    </article>
  );
}
