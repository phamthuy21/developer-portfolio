import React from 'react';
import { Container } from '../public/Container';
import { SocialLinks } from '../public/SocialLinks';
import Link from 'next/link';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold tracking-tight">Portfolio</h3>
            <p className="mt-4 text-muted-foreground max-w-sm text-sm">
              Building scalable web applications with modern technologies. 
              Always learning, always coding.
            </p>
            <div className="mt-6">
              <SocialLinks 
                github="https://github.com/phamthuy21" 
                linkedin="https://www.linkedin.com/in/pdt21/"
                email="phamthuy2192001@gmail.com"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/experience" className="hover:text-primary transition-colors">Experience</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Developer Portfolio. All rights reserved.</p>
          {/* <p>
            Built with <span className="text-foreground font-medium">Next.js</span> and <span className="text-foreground font-medium">NestJS</span>
          </p> */}
        </div>
      </Container>
    </footer>
  );
}
