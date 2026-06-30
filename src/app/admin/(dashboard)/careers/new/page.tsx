"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  IndianRupee,
  MapPin,
  FileText,
  Save,
  Loader2,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const DEPARTMENTS = [
  "Medical",
  "Nursing",
  "Radiology",
  "Laboratory",
  "Pharmacy",
  "Emergency",
  "Administration",
  "IT",
  "Finance",
  "HR",
  "Operations",
  "Other",
];

export default function NewCareerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "",
    experience: "",
    salary: "",
    jobType: "Full-time",
    description: "",
    requirements: "",
    location: "Narnaul",
    status: "DRAFT" as "ACTIVE" | "CLOSED" | "DRAFT",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (publishStatus: "ACTIVE" | "DRAFT") => {
    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/careers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, status: publishStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to create job posting");
      }

      const data = await response.json();
      if (data.success) {
        toast.success(
          publishStatus === "ACTIVE"
            ? "Job posted successfully!"
            : "Job saved as draft"
        );
        router.push("/admin/careers");
      }
    } catch {
      toast.error("Failed to create job posting");
    } finally {
      setSaving(false);
    }
  };

  const parsedRequirements = form.requirements
    .split("\n")
    .map((r) => r.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/careers"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create New Job Posting
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Fill in the details to create a new job listing
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-500" />
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Staff Nurse"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Building2 className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Briefcase className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Clock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g., 2-5 years"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <IndianRupee className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g., 3-5 LPA"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., Narnaul"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              Job Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Requirements{" "}
                  <span className="text-slate-400 font-normal">
                    (one per line)
                  </span>
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={5}
                  placeholder={`- B.Sc Nursing or equivalent\n- 2+ years experience in a hospital setting\n- Valid nursing license\n- Strong communication skills`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm resize-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit("ACTIVE")}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Publish Job
            </button>
            <button
              onClick={() => handleSubmit("DRAFT")}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <Link
              href="/admin/careers"
              className="px-6 py-3 rounded-xl text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 sticky top-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-500" />
              Preview
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {form.title || "Job Title"}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.department && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-100">
                      {form.department}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {form.jobType}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                {form.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {form.location}
                  </div>
                )}
                {form.experience && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {form.experience}
                  </div>
                )}
                {form.salary && (
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {form.salary}
                  </div>
                )}
              </div>

              {form.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                    {form.description}
                  </p>
                </div>
              )}

              {parsedRequirements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Requirements
                  </p>
                  <ul className="space-y-1.5">
                    {parsedRequirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-xs text-slate-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!form.title && !form.description && (
                <p className="text-xs text-slate-400 text-center py-8">
                  Start filling the form to see a preview here
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
