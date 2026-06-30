'use client';

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHoverAnimation,
  buttonHoverAnimation,
} from "@/lib/animations";

const HEALTH_PACKAGES = [
  {
    id: 1,
    name: "General Checkup",
    price: 2000,
    duration: "2-3 hours",
    description: "Essential health screening for adults",
    tests: [
      "Complete Blood Count (CBC)",
      "Blood Sugar (Fasting)",
      "Lipid Profile",
      "Liver Function Tests",
      "Kidney Function Tests",
      "Thyroid Profile (TSH)",
      "Blood Pressure Monitoring",
      "BMI Assessment",
    ],
    highlights: ["Best for preventive care", "Annual screening"],
    color: "from-blue-50 to-blue-100",
  },
  {
    id: 2,
    name: "Complete Body Checkup",
    price: 5000,
    duration: "4-5 hours",
    description: "Comprehensive full body health assessment",
    tests: [
      "Complete Blood Count",
      "Metabolic Panel",
      "Lipid Profile",
      "Liver & Kidney Tests",
      "Thyroid Profile",
      "ECG (Heart)",
      "Chest X-Ray",
      "Urinalysis",
      "Stool Test",
      "Abdominal Ultrasound",
      "Vision & Hearing Test",
      "Blood Pressure & BMI",
    ],
    highlights: ["Most comprehensive", "Suitable for all ages"],
    color: "from-green-50 to-green-100",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Cardio Package",
    price: 4000,
    duration: "3-4 hours",
    description: "Specialized cardiac health screening",
    tests: [
      "ECG (Electrocardiogram)",
      "2D Echocardiography",
      "Lipid Profile",
      "Blood Sugar (Fasting)",
      "Blood Pressure Monitoring",
      "Homocysteine Level",
      "Triglycerides & Cholesterol",
      "Stress Test (if recommended)",
      "Consultation with Cardiologist",
    ],
    highlights: ["For heart health", "Post-cardiac care"],
    color: "from-red-50 to-red-100",
  },
  {
    id: 4,
    name: "Diabetic Package",
    price: 3000,
    duration: "2-3 hours",
    description: "Complete diabetes screening and management",
    tests: [
      "Fasting Blood Sugar",
      "Post-Meal Blood Sugar",
      "HbA1c (3-month average)",
      "Lipid Profile",
      "Kidney Function Tests",
      "Liver Function Tests",
      "Urine Microalbumin",
      "Thyroid Profile",
      "Blood Pressure Monitoring",
      "Dietitian Consultation",
    ],
    highlights: ["Diabetes screening", "Diabetes management"],
    color: "from-amber-50 to-amber-100",
  },
  {
    id: 5,
    name: "Women's Health Package",
    price: 3500,
    duration: "3-4 hours",
    description: "Specialized health screening for women",
    tests: [
      "Complete Blood Count",
      "Metabolic Panel",
      "Thyroid Profile",
      "Gynecological Consultation",
      "Breast Examination",
      "Pap Smear (if eligible)",
      "Abdominal Ultrasound",
      "Bone Density Scan",
      "Mammography (age >40)",
      "Hormonal Profile",
    ],
    highlights: ["Women-focused care", "Hormonal health"],
    color: "from-pink-50 to-pink-100",
  },
  {
    id: 6,
    name: "Senior Citizen Package",
    price: 4500,
    duration: "4-5 hours",
    description: "Comprehensive health screening for elderly",
    tests: [
      "Complete Blood Count",
      "Metabolic Panel",
      "Lipid Profile",
      "ECG & Chest X-Ray",
      "2D Echocardiography",
      "Bone Density Scan",
      "Thyroid & Kidney Tests",
      "Liver Function Tests",
      "Cognitive Assessment",
      "Vision & Hearing Test",
      "Blood Pressure Monitoring",
      "Geriatric Consultation",
    ],
    highlights: ["Age >60 years", "Preventive geriatric care"],
    color: "from-purple-50 to-purple-100",
  },
  {
    id: 7,
    name: "Pre-Marriage Health Package",
    price: 2500,
    duration: "2-3 hours",
    description: "Health assessment before marriage",
    tests: [
      "Complete Blood Count",
      "Blood Group & Typing",
      "Blood Sugar (Fasting)",
      "Lipid Profile",
      "Liver & Kidney Tests",
      "HIV, Hepatitis B, Hepatitis C",
      "Syphilis Test (RPR/VDRL)",
      "General Physical Examination",
      "Blood Pressure Monitoring",
    ],
    highlights: ["Pre-marital screening", "Genetic counseling"],
    color: "from-indigo-50 to-indigo-100",
  },
  {
    id: 8,
    name: "Executive Health Package",
    price: 6000,
    duration: "5-6 hours",
    description: "Premium comprehensive health assessment",
    tests: [
      "Advanced Blood Tests",
      "Complete Blood Count",
      "Metabolic & Lipid Panel",
      "Thyroid & Kidney Tests",
      "ECG & Echocardiography",
      "Chest X-Ray",
      "Abdominal Ultrasound",
      "Stress Management Counseling",
      "Nutritionist Consultation",
      "Fitness Assessment",
      "Sleep Study (if needed)",
      "Executive Health Report",
    ],
    highlights: ["Premium screening", "Personalized consultation"],
    color: "from-slate-50 to-slate-100",
    badge: "Premium",
  },
];

const FAQ_ITEMS = [
  {
    question: "How should I prepare for my health package screening?",
    answer:
      "Most packages require 10-12 hours fasting. Avoid heavy exercise the day before. Wear comfortable clothing and bring a valid ID and insurance details. Contact us for specific preparation instructions.",
  },
  {
    question: "How long does the screening take?",
    answer:
      "Duration varies by package (2-6 hours). We recommend scheduling in the morning. Results are typically available within 3-5 business days.",
  },
  {
    question: "Are the packages covered by insurance?",
    answer:
      "Many packages are covered under health insurance. Please check with your insurance provider. We can assist with documentation and claim processing.",
  },
  {
    question: "Can I customize a package?",
    answer:
      "Absolutely! We offer customized health packages tailored to your specific needs. Contact our team to discuss your requirements.",
  },
  {
    question: "What happens after the screening?",
    answer:
      "You'll receive a comprehensive health report. Our doctors will review results and provide consultation. Additional tests may be recommended if needed.",
  },
  {
    question: "Can family members book together?",
    answer:
      "Yes! We offer family health packages with discounted rates. Contact us for family package pricing and scheduling.",
  },
];

const COMPARISON_TABLE = [
  {
    feature: "Blood Tests",
    general: "✓",
    complete: "✓",
    cardio: "✓",
    diabetic: "✓",
    women: "✓",
    senior: "✓",
  },
  {
    feature: "Ultrasound",
    general: "✗",
    complete: "✓",
    cardio: "✗",
    diabetic: "✗",
    women: "✓",
    senior: "✓",
  },
  {
    feature: "ECG",
    general: "✗",
    complete: "✓",
    cardio: "✓",
    diabetic: "✗",
    women: "✗",
    senior: "✓",
  },
  {
    feature: "X-Ray",
    general: "✗",
    complete: "✓",
    cardio: "✗",
    diabetic: "✗",
    women: "✗",
    senior: "✓",
  },
  {
    feature: "Specialist Consultation",
    general: "✗",
    complete: "✓",
    cardio: "✓",
    diabetic: "✓",
    women: "✓",
    senior: "✓",
  },
  {
    feature: "Duration",
    general: "2-3 hrs",
    complete: "4-5 hrs",
    cardio: "3-4 hrs",
    diabetic: "2-3 hrs",
    women: "3-4 hrs",
    senior: "4-5 hrs",
  },
];

export function HealthPackagesContent() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/15 to-transparent py-20 md:py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Health Packages for Every Need
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Comprehensive health screening packages designed to keep you and your family healthy.
              Choose from our specially curated health plans with affordable pricing and expert medical consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#packages">
                <Button size="lg">Explore Packages</Button>
              </Link>
              <Link href="/book-appointment">
                <Button size="lg" variant="outline" className="!text-black">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Packages Grid Section */}
      <section id="packages" className="py-20 md:py-32">
        <Container>
          <SectionHeading
            subtitle="Our Offerings"
            title="Health Screening Packages"
            description="Select the package that best suits your health needs and start your journey to wellness"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {HEALTH_PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`h-full bg-gradient-to-br ${pkg.color} overflow-hidden border border-slate-200`}>
                  <div className="relative h-40 bg-gradient-to-r from-primary to-accent flex items-center justify-center p-4">
                    {pkg.badge && (
                      <div className="absolute top-4 right-4 bg-warm !text-black px-3 py-1 rounded-full text-xs font-semibold">
                        {pkg.badge}
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold !text-black mb-2">
                        {pkg.name}
                      </h3>
                      <p className="!text-black/80 text-sm">{pkg.description}</p>
                    </div>
                  </div>

                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-600 text-sm">Starting From</p>
                        <p className="text-3xl font-bold text-primary">
                          ₹{pkg.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-600 text-sm">Duration</p>
                        <p className="font-semibold text-slate-900">
                          {pkg.duration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase font-semibold text-slate-600 mb-2">
                        Highlights
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase font-semibold text-slate-600 mb-3">
                        Includes {pkg.tests.length} Tests
                      </p>
                      <ul className="space-y-2">
                        {pkg.tests.slice(0, 5).map((test, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-700">
                            <span className="text-accent mr-2 mt-1">✓</span>
                            {test}
                          </li>
                        ))}
                        {pkg.tests.length > 5 && (
                          <li className="text-sm text-slate-500 italic">
                            +{pkg.tests.length - 5} more tests
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardBody>

                  <CardFooter className="border-t border-slate-200 bg-white/50">
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/book-appointment" className="block">
                        <Button className="w-full" variant="primary">
                          Book Now
                        </Button>
                      </Link>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <Container>
          <SectionHeading
            subtitle="Compare Packages"
            title="Package Features at a Glance"
            description="See what's included in each package and choose the perfect fit for your health needs"
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-accent !text-black">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">General</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">Complete</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">Cardio</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">Diabetic</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">Women</th>
                  <th className="px-4 py-4 text-center font-semibold text-sm">Senior</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.general}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.complete}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.cardio}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.diabetic}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.women}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">
                      {row.senior}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <Container>
          <SectionHeading
            subtitle="Questions Answered"
            title="Frequently Asked Questions"
            description="Get answers to common questions about our health packages"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {FAQ_ITEMS.map((item, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <div className="bg-white rounded-xl p-6 border border-slate-200 h-full hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <Container>
          <SectionHeading
            subtitle="Why Choose Us"
            title="Benefits of Our Health Packages"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "🏥",
                title: "State-of-the-Art Facilities",
                description:
                  "Modern diagnostic equipment and comfortable testing environment for accurate results",
              },
              {
                icon: "👨‍⚕️",
                title: "Expert Medical Team",
                description:
                  "Experienced doctors and technicians ensure accurate screening and professional guidance",
              },
              {
                icon: "💰",
                title: "Affordable Pricing",
                description:
                  "Transparent pricing with no hidden charges. Compare and choose the perfect package for your budget",
              },
              {
                icon: "📊",
                title: "Comprehensive Reports",
                description:
                  "Detailed health reports with recommendations and follow-up guidance from specialists",
              },
              {
                icon: "⏱️",
                title: "Quick Turnaround",
                description:
                  "Results available within 3-5 business days with easy online access to your reports",
              },
              {
                icon: "🛡️",
                title: "Privacy & Confidentiality",
                description:
                  "All health information kept completely confidential with secure digital storage",
              },
            ].map((benefit, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <div className="bg-white rounded-xl p-8 text-center h-full hover:shadow-lg transition-shadow border border-slate-200">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary via-primary/90 to-accent !text-black">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Need a Custom Package?
            </h2>
            <p className="text-lg !text-black/90 mb-8 leading-relaxed">
              We understand that health needs are unique. Our team can create a customized
              health package tailored specifically to your requirements and health concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Contact Us
                </Button>
              </Link>
              <Link href="/book-appointment">
                <Button size="lg" variant="outline" className="border-white !text-black hover:bg-white/10">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-20 bg-slate-900 !text-black">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to Invest in Your Health?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Call us now to book your health package or get more information from our healthcare specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div>
                <p className="text-slate-400 text-sm">Call us at</p>
                <a
                  href="tel:+919306710615"
                  className="text-2xl font-bold text-accent hover:text-accent/80"
                >
                  +91 93067 10615
                </a>
              </div>
              <div className="hidden sm:block border-r border-slate-700"></div>
              <div>
                <p className="text-slate-400 text-sm">Email us at</p>
                <a
                  href="mailto:contact@vijayhospitalnarnaul.com"
                  className="text-lg font-semibold text-accent hover:text-accent/80"
                >
                  contact@vijayhospitalnarnaul.com
                </a>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
