"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays, Clock, User, Phone, Mail, Stethoscope,
  CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Loader2,
} from "lucide-react";

const SPECIALTIES = [
  { id: "Cardiology",       label: "Cardiology",        icon: "❤️",  desc: "Heart & vascular conditions" },
  { id: "Neurology",        label: "Neurology",          icon: "🧠",  desc: "Brain & nervous system" },
  { id: "Orthopedics",      label: "Orthopedics",        icon: "🦴",  desc: "Bones, joints & muscles" },
  { id: "Maternity",        label: "Maternity",          icon: "🤱",  desc: "Pregnancy & maternal care" },
  { id: "Oncology",         label: "Oncology",           icon: "🎗️", desc: "Cancer diagnosis & treatment" },
  { id: "Emergency",        label: "Emergency",          icon: "🚑",  desc: "Urgent & trauma care" },
  { id: "Pediatrics",       label: "Pediatrics",         icon: "👶",  desc: "Children's health" },
  { id: "Gynecology",       label: "Gynecology",         icon: "🌸",  desc: "Women's health" },
  { id: "General Surgery",  label: "General Surgery",    icon: "⚕️", desc: "Surgical procedures" },
  { id: "Gastroenterology", label: "Gastroenterology",   icon: "🫁",  desc: "Digestive system" },
  { id: "ENT",              label: "ENT",                icon: "👂",  desc: "Ear, nose & throat" },
  { id: "Ophthalmology",    label: "Ophthalmology",      icon: "👁️", desc: "Eye care" },
];

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM",
];

const STEPS = [
  { num: 1, label: "Specialty" },
  { num: 2, label: "Doctor" },
  { num: 3, label: "Schedule" },
  { num: 4, label: "Details" },
  { num: 5, label: "Confirm" },
];

interface Doctor {
  id: string;
  name: string;
  specialty: string | null;
  experience: string;
  photoUrl?: string | null;
}

interface BookingData {
  specialty: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  symptoms: string;
}

const EMPTY: BookingData = {
  specialty: "", doctorId: "", doctorName: "",
  date: "", time: "", name: "", phone: "", email: "",
  age: "", gender: "", symptoms: "",
};

function getNextDates(n = 10) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0) dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function fmtDate(s: string) {
  return new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export default function BookAppointmentForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(EMPTY);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    if (!data.specialty) return;
    setLoadingDoctors(true);
    fetch(`/api/doctors?specialty=${encodeURIComponent(data.specialty)}`)
      .then(r => r.json())
      .then(res => setDoctors(res.data ?? []))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, [data.specialty]);

  const set = (field: keyof BookingData, value: string) =>
    setData(d => ({ ...d, [field]: value }));

  const canNext = () => {
    if (step === 1) return !!data.specialty;
    if (step === 2) return !!data.doctorId;
    if (step === 3) return !!data.date && !!data.time;
    if (step === 4) return !!data.name && !!data.phone && data.phone.length >= 10;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: data.name, patientPhone: data.phone, patientEmail: data.email,
          doctorId: data.doctorId, date: data.date, time: data.time,
          age: data.age, gender: data.gender, symptoms: data.symptoms,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBookingRef(json.data.id.slice(-8).toUpperCase());
        setSubmitted(true);
      } else {
        setError(json.error || "Booking failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-8 py-10">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Appointment Booked!</h2>
          <p className="text-slate-500">We'll send a reminder before your visit.</p>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100 p-8 space-y-4 text-left shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booking Reference</span>
            <span className="font-bold text-emerald-600 font-mono text-lg">#{bookingRef}</span>
          </div>
          {[
            { label: "Patient", value: data.name },
            { label: "Doctor", value: data.doctorName },
            { label: "Department", value: data.specialty },
            { label: "Date", value: fmtDate(data.date) },
            { label: "Time", value: data.time },
            { label: "Phone", value: data.phone },
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">{item.label}</span>
              <span className="text-slate-900 font-semibold">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 text-left">
          📍 Please arrive <strong>15 minutes early</strong>. Bring a valid ID and any previous medical reports.
        </div>

        <button
          onClick={() => { setSubmitted(false); setStep(1); setData(EMPTY); }}
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition text-sm"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > s.num ? "bg-emerald-500 text-white" :
                step === s.num ? "bg-primary text-black ring-4 ring-primary/20" :
                "bg-slate-200 text-slate-400"
              }`}>
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${step === s.num ? "text-primary" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${step > s.num ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Select a Department</h2>
            <p className="text-slate-500 text-sm mt-1">Choose the medical specialty you need</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {SPECIALTIES.map(spec => (
              <button key={spec.id}
                onClick={() => { set("specialty", spec.id); set("doctorId", ""); set("doctorName", ""); }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  data.specialty === spec.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                }`}>
                <span className="text-3xl">{spec.icon}</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{spec.label}</p>
                  <p className="text-slate-500 text-xs">{spec.desc}</p>
                </div>
                {data.specialty === spec.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Choose Your Doctor</h2>
            <p className="text-slate-500 text-sm mt-1">{data.specialty} specialists available</p>
          </div>
          {loadingDoctors ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading doctors…</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl">👨‍⚕️</div>
              <p className="text-slate-600 font-medium">No doctors listed for {data.specialty} yet.</p>
              <p className="text-slate-400 text-sm">Call us: <a href="tel:+919306710615" className="text-primary font-semibold">+91 93067 10615</a></p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map(doc => (
                <button key={doc.id}
                  onClick={() => { set("doctorId", doc.id); set("doctorName", doc.name); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    data.doctorId === doc.id ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 hover:border-primary/40"
                  }`}>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {doc.photoUrl
                      ? <Image src={doc.photoUrl} alt={doc.name} width={56} height={56} className="object-cover w-full h-full" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">👨‍⚕️</div>}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">{doc.name}</p>
                    <p className="text-slate-500 text-xs">{doc.specialty} · {doc.experience}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Available</span>
                  </div>
                  {data.doctorId === doc.id && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Pick a Date & Time</h2>
            <p className="text-slate-500 text-sm mt-1">With {data.doctorName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" /> Select Date
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {getNextDates().map(date => {
                const d = new Date(date + "T00:00:00");
                return (
                  <button key={date} onClick={() => set("date", date)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      data.date === date ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-primary/40 text-slate-700"
                    }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                    <span className="text-xl font-bold mt-0.5">{d.getDate()}</span>
                    <span className="text-[10px] opacity-60">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {data.date && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Select Time
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map(t => (
                  <button key={t} onClick={() => set("time", t)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      data.time === t ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-primary/40 text-slate-700"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Details</h2>
            <p className="text-slate-500 text-sm mt-1">We need a few details to confirm your appointment</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <input value={data.name} onChange={e => set("name", e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
              <input value={data.phone} onChange={e => set("phone", e.target.value)}
                type="tel" placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal">(optional)</span></label>
              <input value={data.email} onChange={e => set("email", e.target.value)}
                type="email" placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
              <input value={data.age} onChange={e => set("age", e.target.value)}
                type="number" min="1" max="120" placeholder="Your age"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
            <div className="flex gap-3">
              {["Male", "Female", "Other"].map(g => (
                <button key={g} onClick={() => set("gender", g)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                    data.gender === g ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600 hover:border-primary/40"
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Symptoms / Chief Complaint <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea value={data.symptoms} onChange={e => set("symptoms", e.target.value)}
              rows={3} placeholder="Briefly describe your symptoms…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
          </div>
        </div>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
            <p className="text-slate-500 text-sm mt-1">Please verify your appointment details</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-6 space-y-4">
            {[
              { label: "Department", value: data.specialty },
              { label: "Doctor", value: data.doctorName },
              { label: "Date", value: fmtDate(data.date) },
              { label: "Time", value: data.time },
              { label: "Patient", value: data.name },
              { label: "Phone", value: data.phone },
              ...(data.symptoms ? [{ label: "Symptoms", value: data.symptoms }] : []),
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4 text-sm py-2 border-b border-emerald-100/60 last:border-0">
                <span className="text-slate-500 font-medium shrink-0">{item.label}</span>
                <span className="text-slate-900 font-semibold text-right">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800">
            📍 Arrive <strong>15 minutes early</strong>. Bring a valid ID and any previous medical reports.
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">⚠️ {error}</div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
        {step > 1 ? (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < 5 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition text-sm disabled:opacity-60">
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>
              : <><CheckCircle2 className="w-4 h-4" /> Confirm Appointment</>}
          </button>
        )}
      </div>
    </div>
  );
}
