import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { fadeInUp, fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import Link from "next/link";
import PatientCareContent from "./content";

export const metadata: Metadata = {
  title: "Patient Care | Vijay Hospital",
  description: "Comprehensive patient care services, admission guidelines, visiting hours, insurance information, and patient rights at Vijay Hospital Narnaul.",
  keywords: ["patient care", "admission guidelines", "visiting hours", "insurance", "patient rights", "TPA"],
  openGraph: {
    title: "Patient Care | Vijay Hospital",
    description: "Comprehensive patient care services and admission guidelines",
    type: "website",
  },
};

export default function PatientCarePage() {
  return (
    <main className="min-h-screen">
      <PatientCareContent />
    </main>
  );
}
