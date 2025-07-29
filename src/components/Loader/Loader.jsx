import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 bg-primary rounded-full flex items-center justify-center"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-white rounded-full"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="w-16 h-16 bg-primary rounded-full"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="w-8 h-8 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loader;