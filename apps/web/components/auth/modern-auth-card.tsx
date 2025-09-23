"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { BorderBeam } from "@/components/ui/aceternity/border-beam";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { ModernInput } from "@/components/ui/aceternity/modern-input";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface ModernAuthCardProps {
  mode: "login" | "signup";
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  error?: string;
}

export function ModernAuthCard({ mode, onSubmit, isLoading, error }: ModernAuthCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <BackgroundGradient className="rounded-[22px] max-w-md w-full p-4">
        <div className="bg-black rounded-[18px] p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-blue-500 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-gray-400">
              {mode === "login" 
                ? "Sign in to your TodoAI account" 
                : "Create your TodoAI account"
              }
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <ModernInput
                  label="First Name"
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  variant="modern"
                  required
                />
                <ModernInput
                  label="Last Name"
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  variant="modern"
                  required
                />
              </div>
            )}

            <ModernInput
              label="Email"
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              variant="modern"
              required
            />

            <ModernInput
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              variant="modern"
              required
            />

            {mode === "signup" && (
              <ModernInput
                label="Confirm Password"
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                variant="modern"
                required
              />
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <ModernButton
              type="submit"
              variant="gradient"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </ModernButton>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={mode === "login" ? "/signup" : "/login"}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </motion.div>
        </div>
      </BackgroundGradient>
    </div>
  );
}
