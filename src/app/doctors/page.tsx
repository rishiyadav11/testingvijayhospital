import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorGridClient from "./DoctorGridClient";
import DoctorsHeroClient from "./DoctorsHeroClient";

export const metadata: Metadata = {
  title: "Find Expert Doctors",
  description:
    "Meet our team of highly qualified doctors and specialists at Vijay Hospital. Browse profiles, check ratings, and book consultations.",
  keywords: [
    "doctors",
    "specialists",
    "medical professionals",
    "Vijay Hospital doctors",
    "cardiologist",
    "neurologist",
    "surgeon",
    "pediatrician",
  ],
  openGraph: {
    title: "Find Expert Doctors at Vijay Hospital",
    description:
      "Meet our team of highly qualified doctors and specialists. Browse profiles and book consultations.",
    type: "website",
    url: "/doctors",
  },
};

export default function DoctorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <DoctorsHeroClient />

        {/* Doctor Grid */}
        <div id="doctors-grid">
          <DoctorGridClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
