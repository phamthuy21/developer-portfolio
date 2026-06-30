"use client";

import React from 'react';
import { Container } from '@/components/public/Container';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { SocialLinks } from '@/components/public/SocialLinks';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedReveal direction="up" delay={0.1}>
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Available for new opportunities
            </div>
          </AnimatedReveal>
          
          <AnimatedReveal direction="up" delay={0.2}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Building scalable <span className="text-primary">web applications</span> with modern technologies.
            </h1>
          </AnimatedReveal>
          
          <AnimatedReveal direction="up" delay={0.3}>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-muted-foreground">
              I&apos;m a full-stack developer specializing in React, Next.js, and Node.js. 
              I build performant, accessible, and beautiful digital experiences.
            </p>
          </AnimatedReveal>
          
          <AnimatedReveal direction="up" delay={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/projects" className={cn(buttonVariants({ size: "lg" }), "rounded-full w-full sm:w-auto")}>
                View My Work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full w-full sm:w-auto")}>
                Download Resume <Download className="ml-2 h-4 w-4" />
              </a>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="up" delay={0.5}>
            <div className="mt-12 flex justify-center">
              <SocialLinks 
                github="https://github.com" 
                linkedin="https://linkedin.com"
                twitter="https://twitter.com"
                iconSize={24} 
              />
            </div>
          </AnimatedReveal>
        </div>
      </Container>
    </section>
  );
}
