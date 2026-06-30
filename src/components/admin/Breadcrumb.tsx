'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

function formatBreadcrumbLabel(segment: string): string {
  // Handle numeric IDs and special cases
  if (/^\d+$/.test(segment)) {
    return `#${segment}`;
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const segments = pathname.split('/').filter((s) => s && s !== 'admin');

  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    ...segments.map((segment, index) => ({
      label: formatBreadcrumbLabel(segment),
      href: `/admin/${segments.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm mb-6">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight size={16} className="text-slate-400 mx-1" />
            )}
            {isLast ? (
              <span className="text-slate-900 font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
