"use client";

import React from 'react';

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  return (
    <body className="antialiased" suppressHydrationWarning>
      <div className="min-h-screen bg-background dark text-foreground">
        {children}
      </div>
    </body>
  );
}
