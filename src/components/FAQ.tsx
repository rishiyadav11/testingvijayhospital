"use client";

import React, { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "What are the patient visiting hours?",
      answer: "To ensure optimal recovery for our patients, visiting hours are from 10:00 AM to 01:00 PM and 05:00 PM to 08:00 PM daily. Only one attendant is allowed in the inpatient wards during non-visiting hours.",
    },
    {
      question: "Do you accept TPA/Insurance?",
      answer: "Yes, Vijay Hospital is empanelled with most major Insurance providers and TPAs. We offer cashless facilities for eligible policies. Please contact our billing desk for the complete list of empanelled partners.",
    },
    {
      question: "How to book an emergency appointment?",
      answer: "Emergencies do not require prior appointments. Our Emergency Department is open 24/7. You can call our hotline at 093067 10615 for immediate ambulance support or guidance.",
    },
    {
      question: "What documents are needed for admission?",
      answer: "For admission, please bring the patient's ID proof (Aadhaar Card/PAN), doctor's referral slip/consultation sheet, relevant diagnostic/test reports, and insurance card/TPA documents if claiming cashless settlement.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="px-6 py-20 bg-surface-container-lowest" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold">
            Help Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
            Common Questions
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant italic">
            सहायता और जानकारी।
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[32px] nutro-shadow border border-surface-variant overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-center p-6 text-left cursor-pointer select-none font-bold text-primary text-base sm:text-lg outline-none"
              >
                <span>{faq.question}</span>
                <span
                  className={`material-symbols-outlined text-primary transition-transform duration-300 ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIdx === idx ? "max-h-40 border-t border-surface-variant/30" : "max-h-0"
                }`}
              >
                <div className="p-6 text-sm sm:text-base text-on-surface-variant font-body leading-relaxed bg-surface-container-low/20">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
