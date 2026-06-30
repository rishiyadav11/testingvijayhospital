import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import HelpFAQsContent from "@/components/HelpFAQsContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help & FAQs | Vijay Hospital",
  description: "Frequently Asked Questions and help center for Vijay Hospital.",
};

export default function HelpFAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-slate-50 to-slate-100 py-20">
        <Container>
          <HelpFAQsContent />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
