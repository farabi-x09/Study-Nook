"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@heroui/react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from 'react-icons/fc';

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    if (!user.email || !user.password) {
      toast.error("Please fill all fields.");
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
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
                  placeholder="••••••••"
                  className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border border-transparent focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-2 font-semibold py-6 rounded-xl transition-all bg-[#E58B19] hover:bg-[#D97706] text-white shadow-lg shadow-[#E58B19]/30 border border-transparent"
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
               <FcGoogle></FcGoogle>
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