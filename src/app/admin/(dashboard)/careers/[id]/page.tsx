"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
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
  CheckCircle2,
  Users,
  Mail,
  Phone,
  Download,
  Eye,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume: string | null;
  coverLetter: string | null;
  status: string;
  createdAt: string;
}

interface CareerData {
  id: string;
  title: string;
  department: string;
  experience: string;
  salary: string | null;
  jobType: string;
  description: string;
  requirements: string;
  location: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  postedAt: string;
  applications: Application[];
}

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

const APP_STATUSES = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

export default function CareerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [careerId, setCareerId] = useState<string>("");
  const [career, setCareer] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "applications">(
    "details"
  );
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

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token");
    }
    return null;
  }, []);

  // Resolve params
  useEffect(() => {
    params.then((p) => setCareerId(p.id));
  }, [params]);

  // Fetch career details
  const fetchCareer = useCallback(async () => {
    if (!careerId) return;
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/careers/${careerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }
        if (response.status === 404) {
          toast.error("Career not found");
          router.push("/admin/careers");
          return;
        }
        throw new Error("Failed to fetch career");
      }

      const data = await response.json();
      if (data.success) {
        setCareer(data.data);
        setForm({
          title: data.data.title,
          department: data.data.department || "",
          experience: data.data.experience || "",
          salary: data.data.salary || "",
          jobType: data.data.jobType || "Full-time",
          description: data.data.description || "",
          requirements: data.data.requirements || "",
          location: data.data.location || "Narnaul",
          status: data.data.status,
        });
        setApplications(data.data.applications || []);
      }
    } catch {
      toast.error("Failed to load career details");
    } finally {
      setLoading(false);
    }
  }, [careerId, getToken, router]);

  useEffect(() => {
    fetchCareer();
  }, [fetchCareer]);

  // Fetch applications separately
  const fetchApplications = useCallback(async () => {
    if (!careerId) return;
    try {
      setAppsLoading(true);
      const token = getToken();
      const response = await fetch(
        `/api/admin/careers/${careerId}/applications?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApplications(data.data.applications);
        }
      }
    } catch {
      // silently fail, we already have data from career fetch
    } finally {
      setAppsLoading(false);
    }
  }, [careerId, getToken]);

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save career
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/careers/${careerId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Job posting updated successfully!");
      fetchCareer();
    } catch {
      toast.error("Failed to update job posting");
    } finally {
      setSaving(false);
    }
  };

  // Update application status
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      setUpdatingAppId(appId);
      const token = getToken();
      const response = await fetch(
        `/api/admin/careers/${careerId}/applications/${appId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      toast.success(`Application marked as ${newStatus}`);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      if (selectedApp?.id === appId) {
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } catch {
      toast.error("Failed to update application status");
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      appSearchQuery === "" ||
      app.name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearchQuery.toLowerCase());
    const matchesStatus =
      appStatusFilter === "ALL" || app.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const appStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "Pending").length,
    reviewed: applications.filter((a) => a.status === "Reviewed").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getAppStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Reviewed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shortlisted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">
          Loading career details...
        </p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">Career Not Found</h2>
        <Link
          href="/admin/careers"
          className="text-violet-600 font-medium text-sm hover:underline"
        >
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/careers"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {career.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {career.department && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {career.department}
                </span>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Posted {formatDate(career.postedAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/careers"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/60">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "details"
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Job Details
          </button>
          <button
            onClick={() => {
              setActiveTab("applications");
              if (applications.length === 0) fetchApplications();
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "applications"
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users className="w-4 h-4" />
            Applications
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "applications"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {applications.length}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "details" ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* Edit Form */}
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DRAFT">Draft</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm resize-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <Link
                    href="/admin/careers"
                    className="px-6 py-3 rounded-xl text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              {/* App Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  {
                    label: "Total",
                    value: appStats.total,
                    color: "bg-slate-100 text-slate-700",
                  },
                  {
                    label: "Pending",
                    value: appStats.pending,
                    color: "bg-amber-50 text-amber-700",
                  },
                  {
                    label: "Reviewed",
                    value: appStats.reviewed,
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Shortlisted",
                    value: appStats.shortlisted,
                    color: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    label: "Rejected",
                    value: appStats.rejected,
                    color: "bg-red-50 text-red-700",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl p-3 text-center ${stat.color}`}
                  >
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs font-semibold opacity-75">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={appSearchQuery}
                    onChange={(e) => setAppSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    {APP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Application List */}
              {appsLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                  <p className="text-slate-500 text-sm">
                    Loading applications...
                  </p>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {appSearchQuery || appStatusFilter !== "ALL"
                      ? "No matching applications"
                      : "No applications yet"}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {appSearchQuery || appStatusFilter !== "ALL"
                      ? "Try adjusting your filters"
                      : "Applications will appear here when candidates apply"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`rounded-xl border p-4 sm:p-5 transition-all cursor-pointer hover:shadow-md ${
                        selectedApp?.id === app.id
                          ? "border-violet-300 bg-violet-50/30 shadow-md"
                          : "border-slate-200/60 bg-white hover:border-slate-300"
                      }`}
                      onClick={() =>
                        setSelectedApp(
                          selectedApp?.id === app.id ? null : app
                        )
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 flex-shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {app.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {app.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {app.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(app.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getAppStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedApp?.id === app.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                              {app.coverLetter && (
                                <div>
                                  <p className="text-xs font-semibold text-slate-700 mb-1">
                                    Cover Letter
                                  </p>
                                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 leading-relaxed">
                                    {app.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3">
                                {/* Resume Download */}
                                {app.resume && (
                                  <a
                                    href={app.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold hover:bg-violet-100 transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    Download Resume
                                  </a>
                                )}

                                {/* Status buttons */}
                                <div className="flex items-center gap-1.5 ml-auto">
                                  {APP_STATUSES.map((status) => (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateAppStatus(app.id, status);
                                      }}
                                      disabled={
                                        app.status === status ||
                                        updatingAppId === app.id
                                      }
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        app.status === status
                                          ? getAppStatusColor(status) +
                                            " border opacity-100"
                                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                      } disabled:cursor-not-allowed`}
                                    >
                                      {updatingAppId === app.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        status
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
