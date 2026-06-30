import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Specialities from "@/components/Specialities";
import Footer from "@/components/Footer";
import SpecialtiesHeroClient from "./SpecialtiesHeroClient";
import SpecialtiesSupportingServices from "./SpecialtiesSupportingServices";

export const metadata: Metadata = {
  title: "Medical Specialties & Departments",
  description:
    "Explore our comprehensive medical specialties and departments at Vijay Hospital. World-class clinicians and advanced technology across all major disciplines.",
  keywords: [
    "medical specialties",
    "departments",
    "cardiology",
    "neurology",
    "orthopedics",
    "pediatrics",
    "ENT",
    "ophthalmology",
  ],
  openGraph: {
    title: "Medical Specialties at Vijay Hospital",
    description:
      "Discover our medical specialties and expert departments providing tertiary care.",
    type: "website",
    url: "/specialties",
  },
};

export default function SpecialtiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <SpecialtiesHeroClient />

        {/* Bento Grid Specialties Section */}
        <Specialities />

        {/* Supporting Services Section */}
        <SpecialtiesSupportingServices />
      </main>
      <Footer />
    </div>
  );
}
