"use client";

// Temporarily bypass authentication for development
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip auth check for now - just render the children directly
  return <>{children}</>;
} 