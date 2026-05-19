"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@heroui/react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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

  const isFormValid = formData.email && formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all fields.");
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/");
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
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-[900px]"
      >
        <div className="theme-card rounded-3xl shadow-xl overflow-hidden border border-amber-200 dark:border-amber-900/40 flex flex-col md:flex-row min-h-[550px]">
          
          {/* Left Side - Image & Copy */}
          <div className="w-full md:w-5/12 relative overflow-hidden min-h-[300px] md:min-h-full p-8 md:p-10 flex flex-col justify-end bg-amber-700/80">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80"
              style={{ backgroundImage: "url('/study-room-bg.png')" }}
            ></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/90 via-amber-600/20 to-transparent"></div>
            
            <div className="relative z-10 text-white mt-auto">
              <h2 className="text-3xl font-bold font-serif mb-4 leading-tight">
                Your focus space awaits.
              </h2>
              <p className="text-white/90 text-sm mb-8 leading-relaxed font-medium">
                Sign in to access your bookings, manage listings, and reserve your next study session in seconds.
              </p>
              
              <div className="flex gap-1.5 items-center">
                <div className="w-6 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 theme-card bg-white dark:bg-[#18181b]">
            <h1 className="text-3xl font-bold theme-text font-serif mb-1">
              Welcome back
            </h1>
            <p className="theme-text-muted text-sm font-medium mb-8">
              Sign in to your StudyNook account.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">EMAIL ADDRESS</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@university.edu"
                  className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border border-transparent focus:border-amber-500 text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">PASSWORD</label>
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border border-transparent focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                isDisabled={!isFormValid}
                className={`w-full mt-2 font-semibold py-6 rounded-xl transition-all ${
                  isFormValid 
                    ? 'bg-[#E58B19] hover:bg-[#D97706] text-white shadow-lg shadow-[#E58B19]/30 border border-transparent' 
                    : 'bg-gray-200 text-gray-600 border border-gray-300 shadow-sm dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 cursor-not-allowed'
                }`}
              >
                Sign In
              </Button>
              
              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                <span className="text-xs text-gray-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
              </div>
              
              <Button
                type="button"
                onClick={() => toast("Google sign-in coming soon!")}
                className="w-full bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium py-6 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <div className="text-center mt-2">
                <p className="text-[13px] theme-text-muted">
                  Don{"'"}t have an account?{' '}
                  <Link href="/register" className="text-[#E58B19] dark:text-[#FBBF24] font-semibold hover:underline">
                    Register free
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;