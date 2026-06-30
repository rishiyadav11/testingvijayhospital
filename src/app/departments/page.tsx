import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SPECIALITIES } from '@/lib/constants';
import DepartmentsListClient from './departments-list-client';

export const metadata: Metadata = {
  title: 'Departments | Vijay Hospital Narnaul',
  description: 'Explore our comprehensive medical departments including Cardiology, Neurology, Orthopedics, and more. Each department staffed with experienced specialists.',
  keywords: ['departments', 'specialties', 'medical departments', 'hospital departments'],
  openGraph: {
    title: 'Departments | Vijay Hospital Narnaul',
    description: 'Explore our comprehensive medical departments with experienced specialists.',
    type: 'website',
  },
};

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-primary/10 via-white to-accent/5 py-16 px-6 border-b border-primary/10">
          <Container className="text-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
                Our Departments
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive medical care across multiple specializations with state-of-the-art facilities and experienced specialists.
              </p>
            </div>
          </Container>
        </section>

        {/* Client Component for Interactive Elements */}
        <DepartmentsListClient specialities={SPECIALITIES} />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/90 to-accent/90 py-16 px-6">
          <Container className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold !text-black mb-4">
              Need Expert Medical Care?
            </h2>
            <p className="!text-black/90 mb-8 text-lg">
              Schedule an appointment with our specialists today.
            </p>
            <Link href="/book-appointment">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-slate-100 !text-black">
                Book Appointment
              </Button>
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
