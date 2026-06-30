'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  side?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within Sheet');
  }
  return context;
};

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);
  const isControlled = onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
  ...props
}: SheetTriggerProps) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: unknown) => {
        const event = e as React.MouseEvent;
        setOpen(true);
        (children as React.ReactElement<{ onClick?: (e: unknown) => void }>)
          .props?.onClick?.(event);
      },
    } as any);
  }

  return (
    <button
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetContent({
  side = 'right',
  className,
  children,
}: SheetContentProps) {
  const { open, setOpen } = useSheet();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setOpen(false)}
      />
      {/* Panel */}
      <div
        className={cn(
          'fixed z-50 bg-white transition-transform duration-300',
          side === 'left'
            ? 'left-0 top-0 h-screen w-full max-w-sm -translate-x-0 border-r'
            : 'right-0 top-0 h-screen w-full max-w-sm translate-x-0 border-l',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
