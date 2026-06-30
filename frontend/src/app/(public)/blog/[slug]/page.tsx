import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/public/Container';
import { Section } from '@/components/public/Section';
import { AnimatedReveal } from '@/components/public/AnimatedReveal';
import { getPublicBlogBySlug, getPublicBlogs } from '@/features/public/blogs/api/get-public-blogs';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export const revalidate = 300;

interface BlogPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const response = await getPublicBlogs({ limit: 100 });
    return (response?.data || []).map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const blog = await getPublicBlogBySlug(params.slug);
    if (!blog) return { title: 'Blog Not Found' };

    return {
      title: `${blog.title} | Blog`,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        type: 'article',
        publishedTime: blog.publishedAt || blog.createdAt,
      },
    };
  } catch (error) {
    return { title: 'Blog Not Found' };
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  let blog = null;
  try {
    blog = await getPublicBlogBySlug(params.slug);
  } catch (error) {
    // handled by !blog below
  }

  if (!blog) {
    notFound();
  }

  return (
    <article className="pt-24 pb-16">
      {/* JSON-LD Structured Data for BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.excerpt,
            datePublished: blog.publishedAt || blog.createdAt,
            dateModified: blog.updatedAt,
            author: {
              '@type': 'Person',
              name: 'Developer Name'
            }
          }),
        }}
      />

      <Container className="max-w-3xl">
        <AnimatedReveal>
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to blog
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4" />
            <time dateTime={new Date(blog.publishedAt || blog.createdAt).toISOString()}>
              {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {blog.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            {blog.excerpt}
          </p>
        </AnimatedReveal>
      </Container>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          <AnimatedReveal delay={0.2}>
            <div className="rounded-2xl bg-card p-6 md:p-10 shadow-sm border">
              <MarkdownRenderer content={blog.content} />
            </div>
          </AnimatedReveal>
        </Container>
      </Section>
    </article>
  );
}
