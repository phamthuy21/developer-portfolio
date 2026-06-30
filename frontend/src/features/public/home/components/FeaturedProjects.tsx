"use client";

import React from 'react';
import { Section } from '@/components/public/Section';
import { SectionTitle } from '@/components/public/SectionTitle';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { EmptyState } from '@/components/public/EmptyState';
import { Project } from '@/features/admin/projects/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Placeholder for ProjectCard which we will create in the projects feature
// We'll just define a simple inline version for now or import it if it exists.
// For now, let's just make a very simple mock card to ensure it works, we will replace it later.

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <Section>
        <SectionTitle title="Featured Projects" subtitle="Some of my recent work" />
        <EmptyState title="No projects found" description="Check back later for new projects." />
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle title="Featured Projects" subtitle="Some of my recent work" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.slice(0, 3).map((project, index) => (
          <AnimatedReveal key={project.id} delay={index * 0.1}>
            <Link href={`/projects/${project.slug}`} className="group block h-full">
              <div className="flex flex-col h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
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
                  <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground line-clamp-2 flex-1">
                    {project.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    View Project <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedReveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/projects" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}>
          View All Projects
        </Link>
      </div>
    </Section>
  );
}
