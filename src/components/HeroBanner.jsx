"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-11/12 max-w-7xl mx-auto rounded-[2rem] overflow-hidden mt-6 mb-12 shadow-2xl bg-neutral-900 font-sans"
    >
      {/* Background Image with Overlay */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')" }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      ></motion.div>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3d3832]/95 via-[#4a443d]/80 to-[#73685c]/40"></div>

      {/* Content Container */}
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 flex flex-col md:flex-row justify-between h-full">
        <motion.div 
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 border border-[#E58B19]/40 rounded-full px-4 py-1.5 text-sm font-semibold text-[#FBBF24] bg-[#E58B19]/10 mb-8 backdrop-blur-sm">
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#E58B19]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            Library Booking Platform
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-[4rem] font-bold leading-[1.1] text-white mb-6 font-serif">
            Find Your Perfect <br className="hidden md:block"/>
            <span className="text-[#FBBF24]">Study Room.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed font-light">
            Browse and book quiet, private study rooms in your library.
            List your own space and earn — transforming idle rooms
            into a thriving scholarly community.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
            <Link href="/explore" className="bg-[#E58B19] hover:bg-[#D97706] text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#E58B19]/20 group">
              Explore Rooms
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </motion.div>
            </Link>
            <Link href="/list" className="border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold transition-all backdrop-blur-sm">
              List a Room
            </Link>
          </motion.div>

          {/* Separator Line */}
          <motion.div variants={itemVariants} className="w-full max-w-[200px] h-px bg-white/20 mb-8"></motion.div>

          {/* Stats */}
          <motion.div 
            variants={containerVariants}
            className="flex flex-wrap items-start gap-8 md:gap-14"
          >
            {[
              { value: "24+", label: "Rooms available" },
              { value: "3.8k", label: "Happy bookers" },
              { value: "12k+", label: "Hours logged" },
              { value: "4.9", label: "Avg. rating", icon: <Star className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24] pb-0.5" /> }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#FBBF24] mb-1 flex items-center gap-1.5">
                  {stat.value}
                  {stat.icon && stat.icon}
                </div>
                <div className="text-[11px] text-gray-300 uppercase tracking-wider font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Card at bottom right - desktop only */}
        <motion.div 
          className="hidden md:flex flex-col justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-[#4d463d]/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-right flex flex-col gap-1 items-end hover:bg-[#4d463d]/60 transition-colors cursor-pointer shadow-xl"
          >
            <span className="text-xs text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Next available
            </span>
            <span className="text-xl font-bold text-[#FBBF24]">The Birch Room</span>
            <span className="text-sm text-gray-200">Floor 2 - Today, 10:00 AM</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
