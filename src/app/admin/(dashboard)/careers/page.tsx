"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Calendar,
  MoreVertical,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Career {
  id: string;
  title: string;
  department: string;
  jobType: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  postedAt: string;
  experience: string;
  salary: string | null;
  location: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token");
    }
    return null;
  }, []);

  const fetchCareers = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(
          `/api/admin/careers?page=${page}&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("admin_token");
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch careers");
        }

        const data = await response.json();
        if (data.success) {
          setCareers(data.data.careers);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [getToken, router]
  );

  useEffect(() => {
    fetchCareers(1);
  }, [fetchCareers]);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setActiveMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also delete all associated applications.`)) {
      return;
    }
    try {
      setDeletingId(id);
      const token = getToken();
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete career");
      toast.success(`"${title}" deleted successfully`);
      fetchCareers(pagination.page);
    } catch {
      toast.error("Failed to delete career");
    } finally {
      setDeletingId(null);
      setActiveMenu(null);
    }
  };

  const handleToggleStatus = async (career: Career) => {
    const newStatus = career.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
    try {
      const token = getToken();
      const response = await fetch(`/api/admin/careers/${career.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success(`"${career.title}" marked as ${newStatus.toLowerCase()}`);
      fetchCareers(pagination.page);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalJobs = careers.length;
    const activeJobs = careers.filter((c) => c.status === "ACTIVE").length;
    const totalApps = careers.reduce((sum, c) => sum + (c._count?.applications || 0), 0);
    const draftJobs = careers.filter((c) => c.status === "DRAFT").length;
    return { totalJobs, activeJobs, totalApps, draftJobs };
  }, [careers]);

  // Filtered careers
  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const matchesSearch =
        searchQuery === "" ||
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || career.status === statusFilter;
      const matchesType =
        typeFilter === "ALL" || career.jobType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [careers, searchQuery, statusFilter, typeFilter]);

  // Unique job types for filter
  const jobTypes = useMemo(() => {
    return [...new Set(careers.map((c) => c.jobType).filter(Boolean))];
  }, [careers]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
          label: "Active",
        };
      case "CLOSED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500",
          icon: XCircle,
          label: "Closed",
        };
      case "DRAFT":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "bg-amber-500",
          icon: AlertCircle,
          label: "Draft",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          dot: "bg-slate-500",
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const statCards = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
    },
    {
      label: "Active Openings",
      value: stats.activeJobs,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Applications",
      value: stats.totalApps,
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
    },
    {
      label: "Draft Jobs",
      value: stats.draftJobs,
      icon: FileText,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            Careers & Jobs
          </h1>
          <p className="text-slate-500 mt-1.5 ml-14">
            Manage job postings and track applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCareers(pagination.page)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <Link
            href="/careers"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Page
          </Link>
          <Link
            href="/admin/careers/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add New Job
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:border-slate-300/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {loading ? "—" : stat.value}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 appearance-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 appearance-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">
              Loading job postings...
            </p>
          </div>
        ) : filteredCareers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center"
          >
            <div className="p-4 rounded-2xl bg-slate-50 w-fit mx-auto mb-5">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "No matching jobs found"
                : "No job postings yet"}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "Create your first job posting to start attracting candidates"}
            </p>
            {!searchQuery && statusFilter === "ALL" && typeFilter === "ALL" && (
              <Link
                href="/admin/careers/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create First Job
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 font-medium">
                Showing{" "}
                <span className="text-slate-900 font-semibold">
                  {filteredCareers.length}
                </span>{" "}
                job{filteredCareers.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCareers.map((career, idx) => {
                  const statusConfig = getStatusConfig(career.status);
                  const appCount = career._count?.applications || 0;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={career.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03, duration: 0.25 }}
                      className={`group bg-white rounded-2xl border border-slate-200/60 hover:shadow-xl hover:border-slate-300/60 transition-all duration-300 overflow-hidden ${
                        deletingId === career.id ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: Job Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                {statusConfig.label}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                {career.jobType}
                              </span>
                              {career.department && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-600 border border-violet-100">
                                  <Building2 className="w-3 h-3" />
                                  {career.department}
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/admin/careers/${career.id}`}
                              className="block group/title"
                            >
                              <h3 className="text-lg font-bold text-slate-900 group-hover/title:text-violet-600 transition-colors truncate">
                                {career.title}
                              </h3>
                            </Link>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-slate-500">
                              {career.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {career.location}
                                </span>
                              )}
                              {career.experience && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  {career.experience}
                                </span>
                              )}
                              {career.salary && (
                                <span className="flex items-center gap-1.5">
                                  <IndianRupee className="w-3.5 h-3.5" />
                                  {career.salary}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Posted {formatDate(career.postedAt)}
                              </span>
                            </div>
                          </div>

                          {/* Right: Application count + Actions */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Application count badge */}
                            <Link
                              href={`/admin/careers/${career.id}`}
                              className="hidden sm:flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group/apps"
                            >
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-xl font-bold text-blue-700">
                                  {appCount}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
                                Applications
                              </span>
                            </Link>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/admin/careers/${career.id}`}
                                className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                title="View & Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>

                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(
                                      activeMenu === career.id
                                        ? null
                                        : career.id
                                    );
                                  }}
                                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeMenu === career.id && (
                                  <div
                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Link
                                      href={`/admin/careers/${career.id}`}
                                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </Link>
                                    <button
                                      onClick={() => handleToggleStatus(career)}
                                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                                    >
                                      <StatusIcon className="w-4 h-4" />
                                      {career.status === "ACTIVE"
                                        ? "Mark as Closed"
                                        : "Mark as Active"}
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                      onClick={() =>
                                        handleDelete(career.id, career.title)
                                      }
                                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Job
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile application count */}
                        <div className="sm:hidden mt-4 flex items-center gap-3">
                          <Link
                            href={`/admin/careers/${career.id}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-sm"
                          >
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-blue-700">
                              {appCount}
                            </span>
                            <span className="text-blue-500 text-xs">
                              applications
                            </span>
                          </Link>
                          {career.department && (
                            <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-50 text-violet-600 border border-violet-100">
                              <Building2 className="w-3 h-3" />
                              {career.department}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-2xl border border-slate-200/60 px-5 py-4">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.totalPages}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchCareers(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => fetchCareers(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
