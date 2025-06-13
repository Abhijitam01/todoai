"use client";

import { useAuthStore } from "@/lib/store/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  return isAuthenticated ? <AppShell>{children}</AppShell> : null;
} 