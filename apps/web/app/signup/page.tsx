"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/store/auth";
import { ModernAuthCard } from "@/components/auth/modern-auth-card";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      const { user, tokens } = res.data.data;

      setAuth(user, tokens.accessToken, tokens.refreshToken);

      addToast({
        title: "Account created!",
        description: "Welcome to TodoAI. Let's start achieving your goals!",
        type: "success",
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernAuthCard
      mode="signup"
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
} 