"use client";



import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/store/auth";
import { ModernAuthCard } from "@/components/auth/modern-auth-card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, tokens } = res.data.data;

      setAuth(user, tokens.accessToken, tokens.refreshToken);

      addToast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
        type: "success",
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernAuthCard
      mode="login"
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
} 