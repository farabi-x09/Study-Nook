"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FCFBF4]">
      <motion.div
        className="w-16 h-16 rounded-2xl bg-[#E58B19] flex items-center justify-center shadow-xl shadow-[#E58B19]/30"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180]
        }}
        transition={{ 
          duration: 2, 
          ease: "easeInOut", 
          repeat: Infinity,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </motion.div>
      <motion.h3 
        className="mt-6 font-extrabold text-2xl tracking-tight text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Study<span className="text-[#E58B19]">Nook</span>
      </motion.h3>
    </div>
  );
}
