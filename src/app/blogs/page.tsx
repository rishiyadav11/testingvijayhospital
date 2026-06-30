import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogsListClient from './blogs-list-client';
import { prisma } from '@/lib/prisma';
import NewsletterForm from '@/components/NewsletterForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Medical Blog - Health Tips & Hospital News | Vijay Hospital',
  description: 'Read our latest blog posts covering health tips, medical advice, wellness guides, and hospital news from Vijay Hospital.',
};

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true, slug: true, title: true, excerpt: true,
      featuredImageUrl: true, category: true, tags: true,
      author: true, publishedAt: true, updatedAt: true, status: true,
      readTime: true, createdAt: true,
    },
  });

  const serialized = blogs.map(b => ({
    id: b.id,
    slug: b.slug ?? b.id,
    title: b.title,
    excerpt: b.excerpt ?? '',
    featuredImageUrl: b.featuredImageUrl ?? null,
    category: b.category,
    author: b.author,
    readTime: b.readTime,
    date: (b.publishedAt ?? b.createdAt).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-xl shadow-emerald-950/10">
          <div className="max-w-3xl space-y-4">
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Medical Blog
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Health Tips & Hospital News</h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              Expert health tips, medical insights, and wellness guides from our specialist doctors.
            </p>
            <p className="text-sm text-emerald-200 font-medium">{serialized.length} articles published</p>
          </div>
        </div>

        <BlogsListClient blogs={serialized} />

        {/* Newsletter */}
        <div className="bg-slate-50 border-t border-slate-100 py-16 px-6">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl">📬</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Subscribe to Health Tips</h2>
            <p className="text-slate-500 text-sm mb-4">Get the latest articles and medical advice delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
