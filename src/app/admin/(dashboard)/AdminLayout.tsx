'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Image as ImageIcon,
  MessageSquare, Briefcase, Calendar, LogOut, Heart,
  Menu, X, ChevronRight, Bell, ExternalLink, Mail
} from 'lucide-react';

interface AdminLayoutProps { children: React.ReactNode }

const NAV = [
  { href: '/admin',              label: 'Dashboard',      icon: LayoutDashboard, color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { href: '/admin/doctors',      label: 'Doctors',        icon: Users,           color: 'text-blue-500',    bg: 'bg-blue-50'    },
  { href: '/admin/appointments', label: 'Appointments',   icon: Calendar,        color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { href: '/admin/blogs',        label: 'Blogs',          icon: BookOpen,        color: 'text-amber-500',   bg: 'bg-amber-50'   },
  { href: '/admin/gallery',      label: 'Gallery',        icon: ImageIcon,       color: 'text-pink-500',    bg: 'bg-pink-50'    },
  { href: '/admin/testimonials', label: 'Testimonials',   icon: MessageSquare,   color: 'text-teal-500',    bg: 'bg-teal-50'    },
  { href: '/admin/patient-stories', label: 'Stories',    icon: Heart,           color: 'text-rose-500',    bg: 'bg-rose-50'    },
  { href: '/admin/careers',      label: 'Careers',        icon: Briefcase,       color: 'text-orange-500',  bg: 'bg-orange-50'  },
  { href: '/admin/subscribers',  label: 'Subscribers',    icon: Mail,            color: 'text-indigo-500',  bg: 'bg-indigo-50'  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Close on outside click (mobile)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar');
      if (sidebarOpen && sidebar && !sidebar.contains(e.target as Node)) setSidebarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    if (!confirm('Sign out of admin?')) return;
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const currentPage = NAV.find(n =>
    n.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(n.href)
  );

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b border-slate-100 ${collapsed ? 'justify-center px-3' : ''}`}>
        <Image
          src="/logo.png"
          alt="Vijay Hospital Logo"
          width={36}
          height={36}
          className="w-9 h-9 object-contain rounded-xl flex-shrink-0"
        />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-none truncate">Vijay Hospital</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${isActive ? 'text-white' : item.color}`}>
                <Icon size={18} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-grow">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-60" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <Link href="/" target="_blank"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'View Site' : undefined}
        >
          <ExternalLink size={18} className="flex-shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 bottom-20 translate-x-full ml-px bg-white border border-slate-200 rounded-r-lg p-1 text-slate-400 hover:text-slate-700 transition-colors hidden lg:block">
          <ChevronRight size={14} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 hidden sm:inline">Admin</span>
              <ChevronRight size={14} className="text-slate-300 hidden sm:inline" />
              <span className="font-semibold text-slate-900">{currentPage?.label ?? 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50">
              <ExternalLink size={13} /> View Site
            </Link>
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                A
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
