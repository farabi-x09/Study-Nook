"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { TextField, Label, InputGroup, Button, Card } from "@heroui/react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/signin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-xl mx-auto"
      >
        <Card className="theme-card rounded-[2rem] shadow-[0_0_50px_-12px_rgba(229,139,25,0.15)] overflow-hidden border p-0" shadow="none">
          {/* Header */}
          <div className="bg-amber-500/10 dark:bg-amber-950/20 px-8 py-10 relative overflow-hidden border-b theme-border text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] text-[#E58B19]">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex justify-center items-center text-white shadow-lg shadow-amber-500/30 mb-5">
                <UserPlus size={28} strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold theme-text font-serif mb-2">
                Create an Account
              </h1>
              <p className="theme-text-muted text-sm max-w-sm font-light">
                Join StudyNook to easily book rooms, manage listings, and discover the perfect spaces for your needs.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-8 py-8 flex flex-col gap-5 overflow-visible theme-text">

              {/* Name */}
              <TextField isRequired className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Full Name</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                    <User size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

              {/* Email */}
              <TextField isRequired className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Email Address</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                    <Mail size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

              {/* Password */}
              <TextField isRequired className="w-full flex flex-col gap-1.5">
                <Label className="block text-sm font-semibold theme-text-muted">Password</Label>
                <InputGroup fullWidth className="theme-border focus-within:border-[#E58B19] focus-within:!ring-[#E58B19] theme-input hover:opacity-95 transition-all rounded-xl theme-text">
                  <InputGroup.Prefix className="pl-3 pr-2 text-gray-400 flex items-center">
                    <Lock size={18} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="theme-text placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </TextField>

            </div>

            <div className="px-8 pb-8 flex flex-col gap-4">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-[#E58B19] hover:bg-[#D97706] text-white font-semibold shadow-lg shadow-[#E58B19]/20 py-3.5"
                radius="full"
                size="lg"
                endContent={!loading && <ArrowRight size={18} strokeWidth={2.5} />}
              >
                Sign Up
              </Button>

              <div className="text-center mt-2">
                <p className="text-sm theme-text-muted">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-[#E58B19] dark:text-[#FBBF24] font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
