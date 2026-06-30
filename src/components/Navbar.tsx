"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SearchDialog } from "@/components/SearchDialog";
import { ChevronDown, Phone, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Translations } from "@/lib/i18n";

type NavKey = keyof Translations["nav"];

const mainLinks: { key: NavKey; href: string }[] = [
  { key: "about",       href: "/about" },
  { key: "departments", href: "/departments" },
  { key: "doctors",     href: "/doctors" },
  { key: "facilities",  href: "/facilities" },
  { key: "contact",     href: "/contact" },
];

const moreLinks: { key: NavKey; href: string }[] = [
  { key: "patientStories",  href: "/patient-stories" },
  { key: "healthResources", href: "/resources" },
  { key: "blogs",           href: "/blogs" },
  { key: "faqs",            href: "/help-faqs" },
  { key: "careers",         href: "/careers" },
  { key: "privacy",         href: "/privacy-policy" },
  { key: "terms",           href: "/terms-of-service" },
];

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  return (
    <div
      data-lang-toggle="navbar"
      className={`flex items-center rounded-full border border-slate-200 overflow-hidden text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => lang !== "en" && toggle()}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-primary text-black" : "text-slate-500 hover:text-primary"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => lang !== "hi" && toggle()}
        aria-pressed={lang === "hi"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "hi" ? "bg-primary text-black" : "text-slate-500 hover:text-primary"
        }`}
      >
        हिं
      </button>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { tr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-[68px] md:top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Row */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="Vijay Hospital"
              width={48}
              height={48}
              className="h-10 w-auto md:h-12"
            />
            <span data-no-translate className="flex flex-col leading-tight">
              <span className="text-base md:text-xl font-bold text-secondary tracking-tight">
                Vijay Hospital
              </span>
              <span className="text-[10px] md:text-xs text-slate-500 tracking-wide">
                Narnaul, Haryana
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  isActive(link.href)
                    ? "text-primary border-primary"
                    : "text-slate-600 border-transparent hover:text-primary"
                }`}
              >
                {tr.nav[link.key]}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1 pb-1 border-b-2 border-transparent group-hover:border-primary">
                {tr.nav.more}
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 top-full mt-0 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {tr.nav[link.key]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LangToggle />
            <SearchDialog />
            <a
              href="tel:+919306710615"
              className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
              title="Call +91 9306710615"
            >
              <Phone size={20} />
            </a>
            <Link href="/book-appointment">
              <Button size="sm" variant="primary" className="!text-black">
                {tr.nav.bookAppointment}
              </Button>
            </Link>
          </div>

          {/* Mobile: language toggle + menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LangToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tr.nav[link.key]}
              </Link>
            ))}

            {/* Mobile More Dropdown */}
            <button
              onClick={() => setOpenDropdown(openDropdown === "more" ? null : "more")}
              className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between"
            >
              {tr.nav.more}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === "more" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "more" && (
              <div className="pl-4 space-y-1">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-primary/5 hover:text-primary"
                  >
                    {tr.nav[link.key]}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Actions */}
            <hr className="my-3 border-slate-100" />
            <div className="px-4 space-y-2">
              <a
                href="tel:+919306710615"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Phone size={18} />
                +91 9306710615
              </a>
              <Link
                href="/book-appointment"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button size="md" variant="primary" className="w-full !text-black">
                  {tr.nav.bookAppointment}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
