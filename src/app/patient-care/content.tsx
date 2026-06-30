'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { fadeInUp, fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import Link from "next/link";

// Accordion Component
function AccordionItem({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors duration-200"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          {content}
        </div>
      </motion.div>
    </div>
  );
}

// Process Stepper Component
function ProcessStepper({
  steps,
}: {
  steps: { number: number; title: string; description: string }[];
}) {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent transform -translate-x-1/2" />

      <div className="space-y-8 md:space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            variants={staggerItem}
            className="relative"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {index % 2 === 0 ? (
                <>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary !text-black flex items-center justify-center font-bold text-xl relative z-10">
                      {step.number}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent !text-black flex items-center justify-center font-bold text-xl relative z-10">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </>
              )}
            </div>
            {/* Mobile step indicator */}
            <div className="md:hidden flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary !text-black flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <h4 className="ml-4 font-semibold text-slate-900">
                {step.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PatientCareContent() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const admissionSteps = [
    {
      number: 1,
      title: "Pre-Admission",
      description: "Contact us and provide basic medical information. Our team will guide you through the process.",
    },
    {
      number: 2,
      title: "Documentation",
      description: "Submit required documents including ID proof, insurance details, and medical reports.",
    },
    {
      number: 3,
      title: "Medical Evaluation",
      description: "Our medical team will review your case and determine the appropriate ward and treatment plan.",
    },
    {
      number: 4,
      title: "Admission",
      description: "Complete formalities and settle into your assigned room. Nursing staff will orient you.",
    },
  ];

  const requiredDocuments = [
    "Valid ID proof (Aadhaar/PAN/Passport/Driving License)",
    "Insurance Policy document (if applicable)",
    "Medical referral or prescriptions from referring doctor",
    "Previous medical reports and test results",
    "Contact details of emergency contacts",
    "Medication list (if on regular medications)",
  ];

  const cashlessPartners = [
    { name: "ICICI Lombard", upi: "ICICI001" },
    { name: "Apollo Munich", upi: "APOLLO001" },
    { name: "HDFC Ergo", upi: "HDFC001" },
    { name: "Bajaj Allianz", upi: "BAJAJ001" },
    { name: "Max Bupa", upi: "MAXBUPA01" },
    { name: "United India Insurance", upi: "UNITED01" },
  ];

  const visitingHours = [
    { day: "Monday - Friday", hours: "3:00 PM - 8:00 PM" },
    { day: "Saturday", hours: "2:00 PM - 8:00 PM" },
    { day: "Sunday", hours: "2:00 PM - 8:00 PM" },
    { day: "Emergency Ward", hours: "24/7" },
  ];

  const patientRights = [
    "Right to receive emergency care",
    "Right to respectful and dignified treatment",
    "Right to privacy and confidentiality",
    "Right to informed consent before any procedure",
    "Right to access your medical records",
    "Right to refuse treatment (with understanding of consequences)",
    "Right to express grievances without fear of retaliation",
    "Right to complimentary interpretation services",
  ];

  const patientResponsibilities = [
    "Provide accurate medical history and information",
    "Follow doctor's instructions and treatment plan",
    "Pay bills on time or arrange for insurance settlement",
    "Respect hospital rules and policies",
    "Keep the ward clean and maintain hygiene",
    "Avoid disturbing other patients and staff",
    "Report any complications immediately",
    "Keep valuables with family; hospital not responsible",
  ];

  const downloadableResources = [
    {
      title: "Admission Form",
      description: "Complete admission form to be filled before hospitalization",
      filename: "admission-form.pdf",
    },
    {
      title: "Insurance Guidelines",
      description: "Guidelines for insurance claim processing and TPA procedures",
      filename: "insurance-guidelines.pdf",
    },
    {
      title: "Patient Information Booklet",
      description: "Comprehensive guide to hospital facilities and services",
      filename: "patient-booklet.pdf",
    },
    {
      title: "Discharge Checklist",
      description: "Important points to remember before discharge",
      filename: "discharge-checklist.pdf",
    },
    {
      title: "Medical Records Request Form",
      description: "Form to request copies of medical records",
      filename: "records-request.pdf",
    },
    {
      title: "Grievance Form",
      description: "Form to lodge complaints and grievances",
      filename: "grievance-form.pdf",
    },
  ];

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your feedback has been received.`);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-primary/10 via-accent/5 to-warm/5 py-20 md:py-32"
      >
        <Container>
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Patient Care Excellence
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We are committed to providing compassionate, high-quality healthcare
              services with a patient-centric approach. From admission to discharge,
              we ensure your comfort and speedy recovery.
            </p>
          </motion.div>
        </Container>
      </motion.section>

      {/* Admission Guidelines Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32"
      >
        <Container>
          <SectionHeading
            subtitle="Seamless Process"
            title="Admission Guidelines"
            description="We've made the admission process simple and straightforward. Follow these steps to ensure a smooth check-in experience."
          />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Accordion */}
            <motion.div variants={staggerItem} className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Required Documents
              </h3>
              <AccordionItem
                title="Essential Documents"
                isOpen={openAccordion === 0}
                onToggle={() =>
                  setOpenAccordion(openAccordion === 0 ? null : 0)
                }
                content={
                  <ul className="space-y-2">
                    {requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-slate-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                }
              />

              <AccordionItem
                title="Insurance Requirements"
                isOpen={openAccordion === 1}
                onToggle={() =>
                  setOpenAccordion(openAccordion === 1 ? null : 1)
                }
                content={
                  <div className="space-y-3 text-slate-700">
                    <p>
                      If you have health insurance, please bring your policy
                      document. For cashless treatment, we accept most major
                      insurance providers.
                    </p>
                    <p>
                      Contact your insurance company before admission to ensure
                      coverage approval.
                    </p>
                  </div>
                }
              />

              <AccordionItem
                title="Billing & Payment"
                isOpen={openAccordion === 2}
                onToggle={() =>
                  setOpenAccordion(openAccordion === 2 ? null : 2)
                }
                content={
                  <div className="space-y-3 text-slate-700">
                    <p>
                      For patients without insurance, we offer flexible payment
                      options including installment plans.
                    </p>
                    <p>
                      We accept cash, credit cards, debit cards, and online
                      transfers. Estimate of charges will be provided upfront.
                    </p>
                  </div>
                }
              />
            </motion.div>

            {/* Process Stepper */}
            <motion.div variants={staggerItem}>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Admission Process
              </h3>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
              >
                <ProcessStepper steps={admissionSteps} />
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </motion.section>

      {/* Insurance & TPA Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32 bg-slate-50"
      >
        <Container>
          <SectionHeading
            subtitle="Cashless Treatment"
            title="Insurance & TPA Partners"
            description="We have tie-ups with major insurance companies and TPAs for seamless cashless treatment."
          />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div variants={staggerItem}>
              <Card className="h-full">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900">
                    Cashless Partners
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    {cashlessPartners.map((partner, idx) => (
                      <div key={idx} className="p-3 bg-primary/5 rounded-lg">
                        <p className="font-semibold text-slate-900 text-sm">
                          {partner.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="h-full">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900">
                    PM-JAY (Ayushman Bharat)
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <p className="text-slate-700">
                      We are an empaneled hospital under Pradhan Mantri Jan
                      Arogya Yojana (PM-JAY).
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">
                          Free treatment up to ₹5 lakhs per family per year
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">
                          No registration fees or charges
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">
                          Coverage for 1,350+ medical procedures
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={staggerItem} className="text-center">
            <p className="text-slate-700 mb-4">
              For more information about insurance coverage and TPA procedures,
              contact our patient relations team.
            </p>
            <Button variant="secondary">Call: +91 93067 10615</Button>
          </motion.div>
        </Container>
      </motion.section>

      {/* Visiting Hours Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32"
      >
        <Container>
          <SectionHeading
            subtitle="Important Information"
            title="Visiting Hours"
            description="Visit your loved ones during designated hours. We maintain these schedules to ensure patient rest and treatment continuity."
          />

          <motion.div variants={staggerItem}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-4 px-6 font-bold text-slate-900 text-lg">
                      Day
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-slate-900 text-lg">
                      Visiting Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visitingHours.map((schedule, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="py-4 px-6 text-slate-900 font-semibold">
                        {schedule.day}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {schedule.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-8 p-6 bg-warm/10 rounded-lg border-l-4 border-warm">
            <p className="text-slate-700">
              <span className="font-semibold">Note:</span> To ensure patient
              privacy and safety, only 2 visitors are allowed per patient at a
              time. Mobile phones must be on silent mode. Children below 12
              years are not allowed in ICU/Isolation wards.
            </p>
          </motion.div>
        </Container>
      </motion.section>

      {/* Patient Rights & Responsibilities Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32 bg-slate-50"
      >
        <Container>
          <SectionHeading
            subtitle="Transparency & Trust"
            title="Patient Rights & Responsibilities"
            description="We believe in transparent healthcare. Know your rights and responsibilities as our patient."
          />

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader className="bg-primary/10">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Your Rights
                  </h3>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-3">
                    {patientRights.map((right, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-slate-700">{right}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader className="bg-accent/10">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Your Responsibilities
                  </h3>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-3">
                    {patientResponsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-slate-700">
                          {responsibility}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </Container>
      </motion.section>

      {/* Feedback Form Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32"
      >
        <Container>
          <SectionHeading
            subtitle="We Value Your Input"
            title="Patient Feedback Form"
            description="Your feedback helps us improve our services. Share your experience and suggestions with us."
          />

          <motion.div variants={staggerItem} className="max-w-2xl mx-auto">
            <Card>
              <CardBody>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="Please describe your feedback topic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                      placeholder="Please share your feedback or suggestions..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Feedback
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </Container>
      </motion.section>

      {/* Downloadable Resources Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 md:py-32 bg-slate-50"
      >
        <Container>
          <SectionHeading
            subtitle="Quick Access"
            title="Downloadable Resources"
            description="Download essential documents and guides for a smoother hospital experience."
          />

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {downloadableResources.map((resource, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <Card className="h-full flex flex-col">
                  <CardBody className="flex-1">
                    <div className="flex items-start mb-4">
                      <svg
                        className="w-10 h-10 text-primary mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">PDF</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <button
                      onClick={() =>
                        alert(
                          `Downloading: ${resource.filename}\n\nThis is a mock download link.`
                        )
                      }
                      className="w-full flex items-center justify-center px-4 py-2 bg-primary !text-black rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={fadeIn}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="py-20 md:py-32 bg-gradient-to-r from-primary to-accent !text-black"
      >
        <Container>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-xl !text-black/90 mb-8 max-w-2xl mx-auto">
              Schedule your visit with our expert doctors. We're here to help you
              on your journey to better health.
            </p>
            <Link href="/book-appointment">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 !text-black"
              >
                Book Appointment Now
              </Button>
            </Link>
          </div>
        </Container>
      </motion.section>
    </>
  );
}
