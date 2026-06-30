import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { ContactForm } from '@/features/public/contact/components/ContactForm';
import { SocialLinks } from '@/components/public/SocialLinks';
import { Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Developer Portfolio',
  description: 'Get in touch for freelance opportunities, consulting, or just to say hi.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero 
        title="Get In Touch" 
        description="I'm currently available for freelance work and new opportunities."
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5">
              <AnimatedReveal>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4">Let&apos;s talk about your project</h2>
                    <p className="text-muted-foreground text-lg">
                      Whether you have a question, a project idea, or just want to connect, feel free to reach out. I&apos;ll try my best to get back to you within 24 hours.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <p className="text-muted-foreground">hello@example.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Location</h3>
                        <p className="text-muted-foreground">San Francisco, CA<br/>Available Remote</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t">
                    <h3 className="font-semibold mb-4 text-lg">Connect with me</h3>
                    <SocialLinks 
                      github="https://github.com" 
                      linkedin="https://linkedin.com"
                      twitter="https://twitter.com"
                      iconSize={24} 
                    />
                  </div>
                </div>
              </AnimatedReveal>
            </div>
            
            <div className="lg:col-span-7">
              <AnimatedReveal delay={0.2} direction="left">
                <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                  <ContactForm />
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
