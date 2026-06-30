import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import HospitalChat from "@/components/HospitalChat";
import { EmergencyBar } from "@/components/EmergencyBar";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AutoTranslate from "@/components/AutoTranslate";
import FloatingLangToggle from "@/components/FloatingLangToggle";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Resolve the canonical site URL. Falls back to the live Vercel deployment URL
// when the custom domain isn't configured yet, so OG/social previews (WhatsApp,
// etc.) can always fetch an absolute, reachable image URL.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.vijayhospitalnarnaul.com");
const SITE_NAME = "Vijay Hospital Narnaul";
const TITLE = "Vijay Hospital Narnaul — Best Multispeciality Hospital in Narnaul, Haryana";
const DESCRIPTION =
  "Vijay Hospital is Narnaul's most trusted multispeciality hospital offering 24/7 emergency & ICU, cardiology, orthopaedics, maternity, ENT, ophthalmology, dental care, paediatrics and general surgery. NABH quality standards, PM-JAY (Ayushman Bharat) empanelled. Opposite Bus Stand, Narnaul, Haryana. Call +91 93067 10615.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Vijay Hospital, Narnaul",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  generator: "Next.js",
  keywords: [
    "Vijay Hospital",
    "Vijay Hospital Narnaul",
    "Hospital in Narnaul",
    "Best hospital Narnaul",
    "Multispeciality hospital Narnaul",
    "Best doctor Narnaul",
    "Cardiology Narnaul",
    "Orthopaedics Narnaul",
    "ICU Narnaul",
    "Emergency hospital Narnaul",
    "Maternity hospital Narnaul",
    "ENT hospital Narnaul",
    "Eye hospital Narnaul",
    "Dental hospital Narnaul",
    "Pediatrics Narnaul",
    "General surgery Narnaul",
    "Narnaul clinic",
    "Ayushman Bharat hospital Narnaul",
    "PMJAY hospital Narnaul",
    "Cashless hospital Narnaul",
    "NABH hospital Narnaul",
    "24 hour hospital Narnaul",
    "नारनौल अस्पताल",
    "विजय हॉस्पिटल नारनौल",
    "नारनौल का सबसे अच्छा अस्पताल",
    "मल्टीस्पेशलिटी अस्पताल नारनौल",
    "आयुष्मान भारत अस्पताल नारनौल",
    "हड्डी रोग नारनौल",
    "हृदय रोग नारनौल",
    "प्रसूति अस्पताल नारनौल",
  ],
  category: "Healthcare",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/hero_consultation.jpg",
        width: 1200,
        height: 630,
        alt: "Vijay Hospital Narnaul — Advanced Healthcare & Clinical Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VijayHospNrnl",
    creator: "@VijayHospNrnl",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/hero_consultation.jpg",
        width: 1200,
        height: 630,
        alt: "Vijay Hospital Narnaul — Advanced Healthcare & Clinical Excellence",
      },
    ],
  },
  other: {
    "geo.position": "28.0444;76.1114",
    "geo.region": "IN-HR",
    "geo.placename": "Narnaul",
    "ICBM": "28.0444, 76.1114",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006a67",
  colorScheme: "light",
};

// Structured data for rich search results (Google Knowledge Panel / Local SEO)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: SITE_NAME,
  alternateName: ["Vijay Hospital", "विजय हॉस्पिटल नारनौल"],
  url: SITE_URL,
  telephone: "+919306710615",
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/hero_consultation.jpg`,
  description: DESCRIPTION,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Insurance",
  isAcceptingNewPatients: true,
  hasMap: "https://maps.google.com/?cid=5114966296855362481",
  sameAs: [
    "https://www.facebook.com/vijayhospitalnarnaul",
    "https://www.instagram.com/vijayhospitalnarnaul",
    "https://www.youtube.com/@vijayhospitalnarnaul",
    "https://www.linkedin.com/company/vijayhospitalnarnaul",
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.0444,
    longitude: 76.1114,
  },
  areaServed: [
    { "@type": "City", name: "Narnaul" },
    { "@type": "State", name: "Haryana" },
    { "@type": "AdministrativeArea", name: "Mahendragarh District" },
  ],
  medicalSpecialty: [
    "Cardiology",
    "Surgery",
    "Emergency",
    "Obstetric",
    "InternalMedicine",
    "Orthopedic",
    "Otolaryngologic",
    "Optometric",
    "Dental",
    "Pediatric",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Opposite Bus Stand",
    addressLocality: "Narnaul",
    addressRegion: "Haryana",
    postalCode: "123001",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+919306710615",
      contactType: "Emergency",
      availableLanguage: ["Hindi", "English"],
      areaServed: "IN",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@type": "ContactPoint",
      telephone: "+919306710615",
      contactType: "Appointment",
      availableLanguage: ["Hindi", "English"],
      areaServed: "IN",
    },
  ],
  availableService: [
    { "@type": "MedicalProcedure", name: "24/7 Emergency Care" },
    { "@type": "MedicalProcedure", name: "Intensive Care Unit (ICU)" },
    { "@type": "MedicalProcedure", name: "General Surgery" },
    { "@type": "MedicalProcedure", name: "Maternity & Childbirth" },
    { "@type": "MedicalProcedure", name: "Cardiology" },
    { "@type": "MedicalProcedure", name: "Orthopaedics & Joint Replacement" },
    { "@type": "MedicalProcedure", name: "ENT Treatment" },
    { "@type": "MedicalProcedure", name: "Ophthalmology & Eye Surgery" },
    { "@type": "MedicalProcedure", name: "Dental Care" },
    { "@type": "MedicalProcedure", name: "Paediatrics & Neonatology" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} scroll-smooth`}>
      <body className="bg-background text-on-surface antialiased pt-[68px] md:pt-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <AutoTranslate />
          {children}
          <FloatingLangToggle />
        </LanguageProvider>
        <Toaster position="top-right" />
        <HospitalChat />

        <EmergencyBar />
      </body>
    </html>
  );
}
