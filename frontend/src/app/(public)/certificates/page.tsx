import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicCertificates } from '@/features/public/certificates/api/get-public-certificates';
import { EmptyState } from '@/components/public/EmptyState';
import { ExternalLink, Award } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Certificates | Developer Portfolio',
  description: 'My certifications, courses, and continuous learning achievements.',
};

export default async function CertificatesPage() {
  const certificates = await getPublicCertificates().catch(() => []);

  return (
    <>
      <PageHero 
        title="Certificates" 
        description="Continuous learning and professional certifications."
      />

      <Section>
        <Container>
          {(!certificates || certificates.length === 0) ? (
            <EmptyState title="No certificates found" description="Certificates are currently unavailable." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <AnimatedReveal key={cert.id} delay={index * 0.1}>
                  <div className="group flex flex-col h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute -right-6 -top-6 text-primary/5 group-hover:text-primary/10 transition-colors">
                      <Award size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                          <Award size={24} />
                        </div>
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label={`View ${cert.name} certificate`}
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cert.name}</h3>
                      <p className="text-muted-foreground font-medium mb-4">{cert.issuer}</p>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Issued</span>
                        <span className="font-semibold">{format(new Date(cert.issueDate), 'MMM yyyy')}</span>
                      </div>
                    </div>
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
