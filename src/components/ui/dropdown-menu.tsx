'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  align?: 'start' | 'end';
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  disabled?: boolean;
}

const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const useDropdown = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within DropdownMenu');
  }
  return context;
};

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  const { setOpen, open } = useDropdown();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        const event = e as React.MouseEvent;
        setOpen(!open);
        (
          children as React.ReactElement<{ onClick?: (e: any) => void }>
        ).props?.onClick?.(event);
      },
    } as any);
  }

  return (
    <button
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = 'start',
  className,
  children,
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdown();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  asChild,
  disabled,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdown();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(
        'w-full px-4 py-2 text-left text-sm hover:bg-slate-100 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      ),
      onClick: (e: any) => {
        if (!disabled) {
          setOpen(false);
          (
            children as React.ReactElement<{ onClick?: (e: any) => void }>
          ).props?.onClick?.(e);
        }
      },
    } as any);
  }

  return (
    <button
      disabled={disabled}
      className={cn(
        'w-full px-4 py-2 text-left text-sm hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      onClick={() => {
        if (!disabled) {
          setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-slate-200" />;
}
