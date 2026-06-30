"use client";

import BookAppointmentForm from "@/components/BookAppointmentForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingSection() {
  const { tr } = useLanguage();
  const b = tr.booking;
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{b.sectionBadge}</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{b.title}</h2>
          <p className="text-slate-500 text-sm mt-2">{b.subtitle}</p>
        </div>
        <BookAppointmentForm />
      </div>
    </section>
  );
}
