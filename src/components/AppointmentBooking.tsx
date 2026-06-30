"use client";

import React, { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import { api } from "@/trpc/react";
import type { AppRouter } from "@/server/api/root";

type Doctor = inferRouterOutputs<AppRouter>["doctor"]["getAll"][number];

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

export default function AppointmentBooking() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { data: doctors } = api.doctor.getAll.useQuery();

  const bookingMutation = api.appointment.book.useMutation({
    onSuccess: () => {
      setBookingSuccess(true);
      setValidationErrors({});
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        doctorId: "",
        date: "",
        time: "",
        notes: "",
      });
    },
    onError: (error) => {
      const zodError = error.data?.zodError;
      if (zodError?.fieldErrors) {
        const errors: Record<string, string> = {};
        const fieldErrors = zodError.fieldErrors as Record<string, string[] | undefined>;
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages[0]) {
            errors[field] = messages[0];
          }
        });
        setValidationErrors(errors);
      } else {
        alert(error.message || "An unexpected error occurred. Please try again.");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.patientName.trim()) errors.patientName = "Name is required";
    if (!formData.patientEmail.trim()) {
      errors.patientEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      errors.patientEmail = "Invalid email format";
    }
    if (!formData.patientPhone.trim()) {
      errors.patientPhone = "Phone number is required";
    } else if (formData.patientPhone.replace(/\D/g, "").length < 10) {
      errors.patientPhone = "Phone number must be at least 10 digits";
    }
    if (!formData.doctorId) errors.doctorId = "Please select a doctor";
    if (!formData.date) errors.date = "Please select an appointment date";
    if (!formData.time) errors.time = "Please select a time slot";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    bookingMutation.mutate(formData);
  };

  return (
    <section className="px-6 py-20 bg-surface-container-low" id="booking-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold">
            Appointment Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
            Schedule Your Visit
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant">
            Enter your details below to request a secure and type-safe appointment slot.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-[40px] nutro-shadow border border-outline-variant/30">
          {bookingSuccess ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <span className="material-symbols-outlined text-5xl">
                  check_circle
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-primary">
                  Appointment Requested!
                </h3>
                <p className="text-on-surface-variant max-w-md mx-auto">
                  Thank you for booking with Vijay Hospital. Our medical staff will contact you shortly to confirm your final slot.
                </p>
              </div>
              <button
                onClick={() => setBookingSuccess(false)}
                className="pill-button bg-primary text-black px-8 py-3 font-semibold hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    PATIENT FULL NAME
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  {validationErrors.patientName && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.patientName}
                    </p>
                  )}
                </div>

                {/* Patient Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    CONTACT NUMBER
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  {validationErrors.patientPhone && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.patientPhone}
                    </p>
                  )}
                </div>

                {/* Patient Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  {validationErrors.patientEmail && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.patientEmail}
                    </p>
                  )}
                </div>

                {/* Select Doctor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    CHOOSE CONSULTANT
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                  >
                    <option value="">Select a Doctor</option>
                    {doctors?.map((doc: Doctor) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                  {validationErrors.doctorId && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.doctorId}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    APPOINTMENT DATE
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                  />
                  {validationErrors.date && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.date}
                    </p>
                  )}
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary block">
                    PREFERRED TIME SLOT
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                  >
                    <option value="">Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {validationErrors.time && (
                    <p className="text-xs text-secondary font-medium">
                      {validationErrors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary block">
                  ADDITIONAL COMMENTS (OPTIONAL)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your health symptoms or specific requirements..."
                  className="w-full px-5 py-3 border border-outline-variant rounded-2xl text-sm font-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full pill-button bg-primary text-black py-4 font-semibold hover:bg-primary/95 transition-colors shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingMutation.isPending ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined text-sm">
                      calendar_month
                    </span>
                  )}
                  {bookingMutation.isPending
                    ? "Submitting request..."
                    : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
