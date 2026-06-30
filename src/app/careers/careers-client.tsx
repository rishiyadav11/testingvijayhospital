"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, List, MapPin, Briefcase, IndianRupee, Search, X } from "lucide-react";

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  salary: string;
  details: string;
}

interface CareersClientProps {
  positions: Position[];
}

export default function CareersClient({ positions }: CareersClientProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique departments and locations
  const departments = ["All", ...new Set(positions.map((p) => p.department))];
  const locations = ["All", ...new Set(positions.map((p) => p.location))];

  // Filter positions
  const filteredPositions = positions.filter((position) => {
    const deptMatch = selectedDepartment === "All" || position.department === selectedDepartment;
    const locMatch = selectedLocation === "All" || position.location === selectedLocation;
    return deptMatch && locMatch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-12 space-y-6">
        {/* Filter Controls */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Department Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Department</label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedDepartment === dept
                      ? "bg-primary text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Location</label>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedLocation === loc
                      ? "bg-accent text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">View</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  viewMode === "list"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="text-slate-700 font-medium">
            Showing <span className="text-primary font-bold">{filteredPositions.length}</span> of{" "}
            <span className="font-bold">{positions.length}</span> positions
          </p>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPositions.map((position) => (
            <Card
              key={position.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setSelectedPosition(position)}
            >
              <CardBody className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {position.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {position.department}
                    </span>
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{position.description}</p>
                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{position.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-primary">
                      <IndianRupee className="w-4 h-4" />
                      <span>{position.salary}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full group-hover:shadow-lg !text-black font-semibold"
                  onClick={() => setSelectedPosition(position)}
                >
                  View Details
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4 mb-12">
          {filteredPositions.map((position) => (
            <Card
              key={position.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPosition(position)}
            >
              <CardBody>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {position.department}
                      </span>
                      <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                        {position.type}
                      </span>
                      <span className="text-xs bg-warm/10 text-warm px-3 py-1 rounded-full font-medium">
                        {position.experience}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-2">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <IndianRupee className="w-4 h-4" />
                        <span>{position.salary}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="whitespace-nowrap !text-black font-semibold"
                    onClick={() => setSelectedPosition(position)}
                  >
                    View Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {filteredPositions.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No positions found</h3>
          <p className="text-slate-600">Try adjusting your filters to see more opportunities.</p>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedPosition && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPosition(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <CardBody className="p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPosition(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Job Details */}
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">{selectedPosition.title}</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                    {selectedPosition.department}
                  </span>
                  <span className="bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold">
                    {selectedPosition.type}
                  </span>
                  <span className="bg-warm/10 text-warm px-4 py-2 rounded-full font-semibold">
                    {selectedPosition.experience}
                  </span>
                </div>
              </div>

              {/* Key Information */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200 text-sm">
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPosition.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><Briefcase className="w-4 h-4" /> Experience</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedPosition.experience}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Salary Range</p>
                  <p className="text-lg font-semibold text-primary">{selectedPosition.salary}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">About This Role</h3>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm">{selectedPosition.details}</p>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <span className="font-semibold text-slate-900">What we're looking for:</span> A dedicated professional
                    with passion for healthcare excellence and patient care. You should be a team player with strong communication
                    skills and commitment to continuous learning.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-900">What we offer:</span> Competitive compensation, comprehensive
                    benefits, professional development opportunities, and a supportive work environment.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#apply" onClick={() => setSelectedPosition(null)} className="flex-1">
                  <span className="flex justify-center items-center w-full py-4 px-6 rounded-full font-bold bg-primary hover:bg-primary/95 text-black hover:shadow-lg active:scale-95 transition-all cursor-pointer text-center text-lg">
                    Apply Now
                  </span>
                </a>
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="flex-1 py-4 px-6 rounded-full font-semibold border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 transition-all duration-300 cursor-pointer text-center text-lg active:scale-95"
                >
                  Close
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
