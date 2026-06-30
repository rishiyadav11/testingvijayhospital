"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface SearchItem {
  id: string;
  title: string;
  category: "doctor" | "department" | "blog" | "page";
  url: string;
  description?: string;
}

const searchItems: SearchItem[] = [
  // Departments
  { id: "cardiology", title: "Cardiology", category: "department", url: "/departments/cardiology", description: "Heart and cardiovascular care" },
  { id: "neurology", title: "Neurology", category: "department", url: "/departments/neurology" },
  { id: "orthopedics", title: "Orthopedics", category: "department", url: "/departments/orthopedics" },
  { id: "maternity", title: "Maternity", category: "department", url: "/departments/maternity" },
  
  // Pages
  { id: "about", title: "About Us", category: "page", url: "/about" },
  { id: "facilities", title: "Facilities", category: "page", url: "/facilities" },
  { id: "book", title: "Book Appointment", category: "page", url: "/book-appointment" },
  { id: "patient-care", title: "Patient Care", category: "page", url: "/patient-care" },
  { id: "packages", title: "Health Packages", category: "page", url: "/health-packages" },
  { id: "careers", title: "Careers", category: "page", url: "/careers" },
  { id: "contact", title: "Contact Us", category: "page", url: "/contact" },
];

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [items, setItems] = useState<SearchItem[]>(searchItems); // static fallback initially
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Fetch complete search context on mount
    fetch("/api/search-context")
      .then((res) => res.json())
      .then((data) => {
        if (data.searchItems) {
          setItems(data.searchItems);
        }
      })
      .catch((err) => console.error("Error loading search items:", err));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, items]);

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery("");
  };

  const getCategoryColor = (category: SearchItem["category"]) => {
    switch (category) {
      case "doctor":
        return "bg-blue-100 text-blue-700";
      case "department":
        return "bg-emerald-100 text-emerald-700";
      case "blog":
        return "bg-purple-100 text-purple-700";
      case "page":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-200 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden sm:inline px-2 py-1 text-xs bg-white rounded border border-slate-300">
          ⌘K
        </kbd>
      </button>

      {/* Modal Backdrop & Dialog (Portaled to document.body) */}
      {isOpen && mounted && createPortal(
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search doctors, departments, pages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-lg"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.url)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{item.title}</p>
                              {item.description && (
                                <p className="text-sm text-slate-500 truncate">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-8 text-center">
                      <p className="text-slate-500">No results found for "{query}"</p>
                    </div>
                  ) : (
                    <div className="p-6">
                      <p className="text-sm text-slate-500 mb-4">Recent searches:</p>
                      <div className="space-y-2">
                        {["Cardiology", "Book Appointment", "About Us"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setQuery(item)}
                            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-sm"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
                  <div>Press <kbd className="px-2 py-1 bg-white border border-slate-300 rounded">ESC</kbd> to close</div>
                  <div>Enter to search</div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
