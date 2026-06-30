"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              alt="Vijay Hospital Logo"
              className="h-16 w-auto object-contain"
              src="/logo.png"
              width={64}
              height={64}
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg font-display text-primary tracking-wide">
                Vijay Hospital
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                Narnaul
              </span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Empowering health through compassionate care and technological mastery. Located in the heart of Narnaul.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {/* Email */}
            <a
              className="w-8 h-8 rounded-full bg-[#EA4335]/10 flex items-center justify-center text-[#EA4335] hover:bg-[#EA4335] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="mailto:contact@vijayhospital.com"
              title="Email Us"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a
              className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="https://www.facebook.com/vijayhospitalnarnaul"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3.625L16 8h-3V7c0-.9.5-1 1-1h2V3h-3c-3 0-4 1.5-4 4v1z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              className="w-8 h-8 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#e1306c] hover:to-[#833ab4] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="https://www.instagram.com/vijayhospitalnarnaul"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              className="w-8 h-8 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="https://www.youtube.com/@vijayhospitalnarnaul"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="https://www.linkedin.com/company/vijayhospitalnarnaul"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
              </svg>
            </a>
            {/* Twitter (X) */}
            <a
              className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter (X)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-primary tracking-widest uppercase font-display">
            Navigation
          </h5>
          <ul className="space-y-3">
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/specialties"
              >
                Specialties
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/doctors"
              >
                Find a Doctor
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/gallery"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/patient-stories"
              >
                Patient Stories
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/testimonials"
              >
                Testimonials
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-primary tracking-widest uppercase font-display">
            Resources
          </h5>
          <ul className="space-y-3">
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/terms-of-service"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/careers"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-on-surface-variant hover:text-primary transition-colors font-body"
                href="/help-faqs"
              >
                Help & FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Emergency */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold text-primary tracking-widest uppercase font-display">
            Emergency? Call Now!
          </h5>
          <div className="bg-surface-container p-6 rounded-[24px] border border-outline-variant/30 space-y-4">
            <div>
              <p className="text-xs font-bold text-primary mb-1">24/7 HELPLINE</p>
              <p className="text-lg font-bold text-primary font-display">+91 93067 10615</p>
              <p className="text-xs text-on-surface-variant mt-2">Immediate help available 24/7</p>
            </div>
            <a
              href="tel:+919306710615"
              className="w-full py-3 bg-primary text-black rounded-full text-xs font-bold hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              Call Emergency Now
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-xs text-on-surface-variant/70 font-body">
            © {new Date().getFullYear()} Vijay Hospital. Healing with Heart, Excellence in Care.
          </p>
          <p className="text-xs text-on-surface-variant/50 font-body">
            Crafted with <Heart className="w-3 h-3 text-red-500 inline-block fill-current" /> by{" "}
            <a
              href="https://www.reworksstudio.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Reworks studio
            </a>
          </p>
        </div>
        <div className="flex gap-6">
          <span className="text-[10px] text-on-surface-variant/50 tracking-widest uppercase font-semibold">
            ISO 14001 Certified
          </span>
          <span className="text-[10px] text-on-surface-variant/50 tracking-widest uppercase font-semibold">
            NABL Compliance
          </span>
        </div>
      </div>
    </footer>
  );
}
