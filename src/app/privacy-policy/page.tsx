import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Vijay Hospital Narnaul. Learn how we protect your personal information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content:
        "Vijay Hospital (\"we,\" \"us,\" \"our\") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information.",
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      content:
        "We collect information you provide directly (name, email, phone, medical history) and information collected automatically (IP address, browser type, pages visited). This helps us improve our services and provide better patient care.",
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      content:
        "Your information is used to: provide healthcare services, respond to inquiries, send appointment reminders, improve our website, comply with legal obligations, and enhance patient experience. We never sell your data.",
    },
    {
      id: "data-security",
      title: "4. Data Security",
      content:
        "We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal information from unauthorized access, alteration, or disclosure.",
    },
    {
      id: "third-party",
      title: "5. Third-Party Sharing",
      content:
        "We only share your information with healthcare providers, insurance companies (with consent), and service providers necessary to deliver our services. All third parties are bound by confidentiality agreements.",
    },
    {
      id: "your-rights",
      title: "6. Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time. Contact us at contact@vijayhospitalnarnaul.com for any privacy concerns.",
    },
    {
      id: "cookies",
      title: "7. Cookies",
      content:
        "Our website uses cookies to enhance user experience. You can control cookie settings in your browser. Essential cookies cannot be disabled as they enable basic site functionality.",
    },
    {
      id: "children-privacy",
      title: "8. Children's Privacy",
      content:
        "Our website is not intended for children under 13. We do not knowingly collect information from children. Parents concerned about their child's data should contact us immediately.",
    },
    {
      id: "policy-updates",
      title: "9. Policy Updates",
      content:
        "We may update this privacy policy periodically. We will notify you of significant changes via email or prominent notice on our website. Your continued use constitutes acceptance of changes.",
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content:
        "For privacy-related questions, contact: Email: privacy@vijayhospitalnarnaul.com | Phone: +91 93067 10615 | Address: Opposite Bus Stand, Narnaul, Haryana 123001",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Header */}
        <section className="border-b border-slate-200 bg-white">
          <Container>
            <div className="py-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-600 mt-3 max-w-2xl">
                Learn how Vijay Hospital protects and respects your personal information
              </p>
            </div>
          </Container>
        </section>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-16">
            {/* Table of Contents - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-all border-l-2 border-transparent hover:border-primary"
                    >
                      {section.title.split(".")[1]}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Metadata */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-slate-600">
                  <span className="font-semibold">Last updated:</span> June 25, 2026
                </p>
                <p className="text-slate-600 mt-3">
                  Please read this privacy policy carefully to understand our practices regarding your personal data.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Questions About This Policy?
                </h3>
                <p className="text-slate-600 mb-4">
                  If you have any questions about this privacy policy or our privacy practices, please don't hesitate to contact us.
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>📧 Email: <a href="mailto:privacy@vijayhospitalnarnaul.com" className="text-primary hover:underline">privacy@vijayhospitalnarnaul.com</a></p>
                  <p>📞 Phone: <a href="tel:+919306710615" className="text-primary hover:underline">+91 9306710615</a></p>
                  <p>📍 Address: Opposite Bus Stand, Narnaul, Haryana 123001</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
