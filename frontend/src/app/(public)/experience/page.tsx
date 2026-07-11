import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicExperiences } from '@/features/public/experiences/api/get-public-experiences';
import { EmptyState } from '@/components/public/EmptyState';
import { format } from 'date-fns';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Experience | Developer Portfolio',
  description: 'My professional experience and work history as a software developer.',
};

export default async function ExperiencePage() {
  const experiences = await getPublicExperiences().catch(() => []);

  return (
    <>
      <PageHero 
        title="Experience" 
        description="My professional journey and the companies I've had the pleasure of working with."
      />

      <Section>
        <Container className="max-w-4xl">
          {(!experiences || experiences.length === 0) ? (
            <EmptyState title="No experience found" description="Experience history is currently unavailable." />
          ) : (
            <div className="relative border-l border-muted-foreground/20 ml-3 md:ml-6 space-y-12">
              {experiences.map((exp, index) => (
                <AnimatedReveal key={exp.id} delay={index * 0.1}>
                  <div className="relative pl-8 md:pl-12">
                    {/* Timeline Dot */}
                    <span className="absolute -left-2.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 ring-8 ring-background">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                      <h3 className="text-xl font-bold">{exp.position}</h3>
                      <div className="text-sm font-medium text-muted-foreground mt-1 sm:mt-0 bg-muted px-2 py-1 rounded-md inline-block">
                        {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isCurrent ? 'Present' : format(new Date(exp.endDate!), 'MMM yyyy')}
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium text-primary mb-4">{exp.company}</h4>
                    
                    <p className="text-muted-foreground">
                      {exp.description}
                    </p>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
