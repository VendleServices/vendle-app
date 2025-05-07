"use client";

import { ReactNode } from 'react';

interface MyProjectsLayoutProps {
  children: ReactNode;
}

export default function MyProjectsLayout({ children }: MyProjectsLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 