import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogDetailClient from './blog-detail-client';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: 'PUBLISHED' },
    select: { title: true, excerpt: true, featuredImageUrl: true },
  });
  if (!blog) return { title: 'Blog Not Found' };
  return {
    title: `${blog.title} | Vijay Hospital Blog`,
    description: blog.excerpt ?? '',
    openGraph: {
      title: blog.title,
      description: blog.excerpt ?? '',
      type: 'article',
      images: blog.featuredImageUrl ? [blog.featuredImageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const blog = await prisma.blog.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: 'PUBLISHED' },
  });

  if (!blog) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-6">
          <div className="text-center max-w-md space-y-4">
            <div className="text-6xl">📖</div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Not Found</h1>
            <p className="text-slate-500">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blogs"
              className="inline-block mt-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
              ← Back to Blogs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch related blogs from same category
  const related = await prisma.blog.findMany({
    where: { status: 'PUBLISHED', category: blog.category, NOT: { id: blog.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, slug: true, title: true, excerpt: true, featuredImageUrl: true, category: true, author: true, readTime: true, createdAt: true },
  });

  const serializedBlog = {
    id: blog.id,
    slug: blog.slug ?? blog.id,
    title: blog.title,
    excerpt: blog.excerpt ?? '',
    content: blog.content,
    featuredImageUrl: blog.featuredImageUrl ?? null,
    category: blog.category,
    author: blog.author,
    readTime: blog.readTime,
    date: (blog.publishedAt ?? blog.createdAt).toISOString(),
    keywords: blog.keywords,
  };

  const serializedRelated = related.map(r => ({
    id: r.id,
    slug: r.slug ?? r.id,
    title: r.title,
    excerpt: r.excerpt ?? '',
    featuredImageUrl: r.featuredImageUrl ?? null,
    category: r.category,
    author: r.author,
    readTime: r.readTime,
    date: r.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        <BlogDetailClient blog={serializedBlog} relatedBlogs={serializedRelated} />
      </main>
      <Footer />
    </div>
  );
}
