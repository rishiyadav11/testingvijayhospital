import { Metadata } from "next";
import { HealthPackagesContent } from "./content";

export const metadata: Metadata = {
  title: "Health Packages | Vijay Hospital Narnaul",
  description: "Comprehensive health screening packages starting from ₹2000. General Checkup, Complete Body Checkup, Cardio, Diabetic & more. Book now for preventive health screening.",
  keywords: "health packages, health screening, medical checkup, preventive care, diagnostic packages",
};

export default function HealthPackagesPage() {
  return <HealthPackagesContent />;
}
