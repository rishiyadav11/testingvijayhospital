import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookAppointmentForm from "@/components/BookAppointmentForm";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        {/* Banner */}
        <div className="bg-primary/5 py-16 px-6 text-center border-b border-outline-variant/30">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold font-display text-primary">
              Contact Vijay Hospital
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
              We are available 24/7 for emergency services and intensive patient care. Reach out via email, phone, or visit our clinic opposite the Narnaul Bus Stand.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-primary text-3xl">
                location_on
              </span>
              <h3 className="text-base font-bold text-primary font-display">Hospital Location</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                Opposite Bus Stand, Narnaul, Haryana - 123001
              </p>
            </div>

            <div className="bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-primary text-3xl">
                call
              </span>
              <h3 className="text-base font-bold text-primary font-display">Helpline Numbers</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                Emergency: +91 93067 10615 <br />
                Reception: 01282-250100
              </p>
            </div>

            <div className="bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-primary text-3xl">
                mail
              </span>
              <h3 className="text-base font-bold text-primary font-display">Email Queries</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                contact@vijayhospital.com <br />
                billing@vijayhospital.com
              </p>
            </div>

            <div className="bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/30 space-y-3">
              <span className="material-symbols-outlined text-primary text-3xl">
                schedule
              </span>
              <h3 className="text-base font-bold text-primary font-display">OPD Hours</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                Mon - Sat: 09:00 AM - 05:00 PM <br />
                Sunday: Closed (Emergency 24/7)
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold font-display text-primary">Find Us on Google Maps</h2>
                <p className="text-sm text-on-surface-variant">Located centrally for quick emergency access.</p>
              </div>
              <a
                href="https://maps.app.goo.gl/Ez3N87tGDSLVR3E8A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group"
              >
                Open in Maps App
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                  arrow_outward
                </span>
              </a>
            </div>
            {/* Google Map Iframe */}
            <div className="w-full h-[450px] rounded-[40px] overflow-hidden border border-outline-variant/30 nutro-shadow relative">
              <iframe
                title="Vijay Hospital Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.094853237411!2d76.10917797553208!3d28.05212827598663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3912b5df235eed8d%3A0x46f9b30f1cf1a8b1!2sVijay%20Hospital!5e0!3m2!1sen!2sin!4v1781430563087!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Book Appointment */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Online Booking</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Book an Appointment</h2>
              <p className="text-slate-500 text-sm mt-2">Expert care in 12+ specialties · Same-day slots available</p>
            </div>
            <BookAppointmentForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
