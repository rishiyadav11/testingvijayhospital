import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Vijay Hospital. Read our conditions and agreements.",
};

export default function TermsPage() {
  const sections = [
    {
      id: "agreement",
      title: "1. Agreement to Terms",
      content:
        "By accessing our website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our website. These terms apply to all users including browsers, customers, vendors, and other visitors.",
    },
    {
      id: "use-license",
      title: "2. Use License",
      content:
        "Permission is granted to temporarily download one copy of materials (information or software) on Vijay Hospital's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. All rights not expressly granted are reserved.",
    },
    {
      id: "disclaimer",
      title: "3. Disclaimer",
      content:
        "The materials on Vijay Hospital's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      id: "limitations",
      title: "4. Limitations of Liability",
      content:
        "In no event shall Vijay Hospital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.",
    },
    {
      id: "accuracy",
      title: "5. Accuracy of Materials",
      content:
        "The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.",
    },
    {
      id: "links",
      title: "6. Links",
      content:
        "We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.",
    },
    {
      id: "modifications",
      title: "7. Modifications",
      content:
        "We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of Haryana, India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
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
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Terms of Service</h1>
              <p className="text-slate-600 mt-3 max-w-2xl">
                Please read these terms carefully before using our website and services
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
              {/* Intro */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-slate-600 leading-relaxed">
                  Welcome to Vijay Hospital's website. These terms of service govern your use of our website and the services we provide. By accessing or using our website, you agree to comply with and be bound by these terms.
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
                  Questions About Our Terms?
                </h3>
                <p className="text-slate-600 mb-4">
                  If you have any questions or concerns about these terms of service, please contact us.
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>📧 Email: <a href="mailto:legal@vijayhospitalnarnaul.com" className="text-primary hover:underline">legal@vijayhospitalnarnaul.com</a></p>
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
