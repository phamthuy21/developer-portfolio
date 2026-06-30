import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicProjects } from '@/features/public/projects/api/get-public-projects';
import { EmptyState } from '@/components/public/EmptyState';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TechnologyBadge } from '@/components/public/TechnologyBadge';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Projects | Developer Portfolio',
  description: 'Explore my portfolio of web applications, tools, and open-source projects.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const projectsResponse = await getPublicProjects({ limit: 12, page }).catch(() => ({ data: [], meta: { total: 0 } }));
  const projects = projectsResponse?.data || [];

  return (
    <>
      <PageHero 
        title="Projects" 
        description="A collection of my recent work, side projects, and open source contributions."
      />

      <Section>
        <Container>
          {(!projects || projects.length === 0) ? (
            <EmptyState title="No projects found" description="Check back later for new projects." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <AnimatedReveal key={project.id} delay={index * 0.1}>
                  <Link href={`/projects/${project.slug}`} className="group block h-full">
                    <div className="flex flex-col h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {project.thumbnail ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No image available</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map(tag => (
                            <TechnologyBadge key={tag} name={tag} variant="secondary" className="text-[10px] px-2 py-0" />
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground line-clamp-2 flex-1">
                          {project.description}
                        </p>
                        <div className="mt-6 flex items-center text-sm font-medium text-primary">
                          View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
