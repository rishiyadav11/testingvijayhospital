'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags. Per the Next.js docs,
    // metadata is set with the React <title> component (not a <head> tag) —
    // an empty <head> here triggers React 19's keyed-children warning and
    // the /_global-error prerender crash.
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc' }}>
        <title>Something went wrong | Vijay Hospital Narnaul</title>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            maxWidth: '440px',
            width: '100%'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: '#ef4444'
            }}>
              <svg style={{ width: '32px', height: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '24px', fontWeight: 700 }}>
              Something went wrong!
            </h2>
            
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
              A critical error occurred. Please try reloading the page.
            </p>
            
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#006a67',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                width: '100%',
                transition: 'background-color 0.2s'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
