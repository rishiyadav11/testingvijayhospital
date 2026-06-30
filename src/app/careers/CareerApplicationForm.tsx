"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string;
}

export default function CareerApplicationForm({
  jobListings,
  selectedPosition = "",
}: {
  jobListings: JobListing[];
  selectedPosition?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message:
            data.message ||
            "Application submitted! We'll review your resume and reach out soon.",
        });
        formRef.current?.reset();
        setFileName("");
      } else {
        setResult({
          success: false,
          message:
            data.error || "Failed to submit application. Please try again.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all text-sm";

  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
      {/* Result Banner */}
      {result && (
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl border ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          )}
          <p className="text-sm font-medium flex-1">{result.message}</p>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Personal Info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Personal Information
        </p>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Position Info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Position Details
        </p>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Position Applied For *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <select
                name="position"
                required
                defaultValue={selectedPosition}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled>
                  Select a position
                </option>
                {jobListings.map((job) => (
                  <option key={job.id} value={job.title}>
                    {job.title} — {job.department}
                  </option>
                ))}
                <option value="General Application">
                  General / Other Positions
                </option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {selectedPosition && (
              <p className="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-selected from your job choice
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Years of Experience *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="experience"
                required
                className={inputClass}
                placeholder="e.g. 3 years"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Qualifications *</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                name="qualifications"
                required
                rows={3}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 resize-none transition-all text-sm"
                placeholder="Your educational qualifications and certifications"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Cover Letter */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Cover Letter
        </p>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          <textarea
            name="coverLetter"
            rows={5}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 resize-none transition-all text-sm"
            placeholder="Tell us why you're the right fit for this role and what drives your passion for healthcare…"
          />
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Resume Upload */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Resume / CV *
        </p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-emerald-500 bg-emerald-50"
              : fileName
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {fileName ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-emerald-700 font-bold text-sm">{fileName}</p>
                <p className="text-xs text-slate-500 mt-1">Click to replace</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-700 font-semibold text-sm">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  PDF, DOC, or DOCX · Max 5 MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          id="agree"
          name="agree"
          required
          className="mt-0.5 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
          I agree that Vijay Hospital may contact me and review my information
          for employment purposes.
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200/80 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting your application…
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Submit Application
          </>
        )}
      </button>
    </form>
  );
}
