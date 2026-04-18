import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212] overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      <div className="w-full max-w-sm px-10 relative z-10 text-center">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Jonathan<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">
            Portfolio Expérience
          </p>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden mb-8">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.5,
              ease: [0.65, 0, 0.35, 1]
            }}
            className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary shadow-[0_0_20px_rgba(135,26,26,0.5)]"
          />
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-2"
        >
          <div className="text-white text-xs font-black uppercase tracking-widest animate-pulse">
            Initialisation...
          </div>
          <p className="text-gray-500 text-[10px] font-light leading-relaxed">
            Optimisation des interfaces pour votre navigateur
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;