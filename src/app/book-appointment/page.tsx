"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookAppointmentForm from "@/components/BookAppointmentForm";

export default function BookAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-slate-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary/90 to-primary py-14 px-6 text-center text-white">
          <h1 className="text-4xl font-bold font-display mb-2">Book an Appointment</h1>
          <p className="text-white/80 text-base">Expert care in 12+ specialties · Same-day slots available</p>
        </div>
        <div className="px-6 py-12">
          <BookAppointmentForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
