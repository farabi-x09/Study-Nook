"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-[#FCFBF4] relative overflow-hidden font-sans">
      
      {/* Background Decorative Elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#E58B19]/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Animated 404 */}
        <motion.div 
          className="relative flex items-center justify-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <h1 className="text-[8rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#E58B19] to-[#FBBF24] leading-none drop-shadow-sm select-none">
            404
          </h1>
          <motion.div 
            className="absolute"
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -15, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-yellow-100 rotate-12">
              <AlertCircle size={48} className="text-[#E58B19]" strokeWidth={2} />
            </div>
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Room Not Found
        </motion.h2>
        
        <motion.p 
          className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          It looks like the study space you{`'`}re looking for doesn{`'`}t exist, has been moved, or is currently unavailable.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-[#E58B19] hover:bg-[#D97706] text-white px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E58B19]/20"
          >
            <Home size={18} strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link 
            href="/rooms" 
            className="w-full sm:w-auto bg-white border border-gray-200 hover:border-[#E58B19] hover:text-[#E58B19] text-gray-700 px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Search size={18} strokeWidth={2.5} />
            Browse Rooms
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
