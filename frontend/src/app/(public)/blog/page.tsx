import { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicBlogs } from '@/features/public/blogs/api/get-public-blogs';
import { EmptyState } from '@/components/public/EmptyState';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog | Developer Portfolio',
  description: 'Read my latest articles, tutorials, and thoughts on software development.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const blogsResponse = await getPublicBlogs({ limit: 12, page }).catch(() => ({ data: [], meta: { total: 0 } }));
  const blogs = blogsResponse?.data || [];

  return (
    <>
      <PageHero 
        title="Blog" 
        description="Thoughts, learnings, and tutorials about software development and design."
      />

      <Section>
        <Container>
          {(!blogs || blogs.length === 0) ? (
            <EmptyState title="No articles found" description="Check back later for new articles." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <AnimatedReveal key={blog.id} delay={index * 0.1}>
                  <Link href={`/blog/${blog.slug}`} className="group block h-full">
                    <div className="flex flex-col h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
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
          )}
        </Container>
      </Section>
    </>
  );
}
