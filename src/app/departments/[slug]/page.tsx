import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SPECIALITIES } from '@/lib/constants';
import DepartmentDetailClient from './department-detail-client';
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Users,
  Hospital,
  Activity,
  Stethoscope,
  Volume2,
  Eye,
  Smile,
  Ambulance
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = SPECIALITIES.find((s) => s.id === slug);
  if (!dept) {
    return {
      title: 'Department Not Found',
    };
  }
  return {
    title: `${dept.name} | Vijay Hospital Narnaul`,
    description: dept.description,
    keywords: [dept.name.toLowerCase(), 'medical department', 'specialists'],
    openGraph: {
      title: `${dept.name} | Vijay Hospital Narnaul`,
      description: dept.description,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return SPECIALITIES.map((dept) => ({
    slug: dept.id,
  }));
}

const getIcon = (iconName: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="w-6 h-6 text-rose-400" />,
    brain: <Brain className="w-6 h-6 text-purple-400" />,
    bone: <Bone className="w-6 h-6 text-slate-300" />,
    baby: <Baby className="w-6 h-6 text-sky-400" />,
    child: <Users className="w-6 h-6 text-emerald-400" />,
    surgery: <Hospital className="w-6 h-6 text-teal-400" />,
    kidney: <Activity className="w-6 h-6 text-rose-500" />,
    stomach: <Stethoscope className="w-6 h-6 text-emerald-400" />,
    ear: <Volume2 className="w-6 h-6 text-amber-400" />,
    eye: <Eye className="w-6 h-6 text-cyan-400" />,
    tooth: <Smile className="w-6 h-6 text-sky-400" />,
    ambulance: <Ambulance className="w-6 h-6 text-red-400" />,
  };
  return iconMap[iconName] || <Hospital className="w-6 h-6 text-teal-400" />;
};

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = SPECIALITIES.find((s) => s.id === slug);

  if (!dept) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-white">
          <Container className="py-20 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Department Not Found</h1>
            <p className="text-lg text-slate-600 mb-8">
              Sorry, we couldn&apos;t find the department you&apos;re looking for.
            </p>
            <Link href="/departments">
              <Button variant="primary" size="lg">
                Back to Departments
              </Button>
            </Link>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28 text-white px-6">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={dept.image}
              alt={dept.name}
              className="w-full h-full object-cover opacity-30 filter brightness-[0.6] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
          </div>

          <Container className="relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  {getIcon(dept.icon)}
                </div>
                {dept.hindiName && (
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    {dept.hindiName}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                  {dept.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-body max-w-2xl">
                  {dept.description}
                </p>
              </div>
              <div className="pt-2">
                <Link href="/departments">
                  <Button variant="outline" size="md" className="text-white border-white/30 hover:bg-white/10 hover:border-white h-10 px-4">
                    ← Back to Departments
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Client Component for Interactive Elements */}
        <DepartmentDetailClient slug={slug} departmentName={dept.name} />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/90 to-accent/90 py-16 px-6">
          <Container className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold !text-black mb-4">
              Ready to Get Expert Care?
            </h2>
            <p className="!text-black/90 mb-8 text-lg">
              Schedule an appointment with our {dept.name} specialists today.
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