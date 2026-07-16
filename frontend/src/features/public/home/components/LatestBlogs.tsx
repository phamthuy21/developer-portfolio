"use client";

import React from 'react';
import { Section } from '@/components/public/Section';
import { SectionTitle } from '@/components/public/SectionTitle';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { EmptyState } from '@/components/public/EmptyState';
import { Blog } from '@/features/admin/blogs/types';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';

interface LatestBlogsProps {
  blogs: Blog[];
}

export function LatestBlogs({ blogs }: LatestBlogsProps) {
  if (!blogs || blogs.length === 0) {
    return (
      <Section className="bg-muted/10">
        <SectionTitle title="Latest Articles" subtitle="Thoughts, learnings, and tutorials" />
        <EmptyState title="No articles found" description="Check back later for new articles." />
      </Section>
    );
  }

  return (
    <Section className="bg-muted/10">
      <SectionTitle title="Latest Articles" subtitle="Thoughts, learnings, and tutorials" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.slice(0, 3).map((blog, index) => (
          <AnimatedReveal key={blog.id} delay={index * 0.1}>
            <Link href={`/blog/${blog.slug}`} className="group block h-full">
              <div className="flex flex-col h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(blog.publishedAt || blog.createdAt).toISOString()}>
                    {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM d, yyyy')}
                  </time>
                </div>
                
                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                
                <p className="mt-4 text-muted-foreground line-clamp-3 flex-1">
                  {blog.excerpt}
                </p>
                
                <div className="mt-6 flex items-center text-sm font-medium text-primary">
                  Read Article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </AnimatedReveal>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/blog" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}>
          View All Articles
        </Link>
      </div>
    </Section>
  );
}
