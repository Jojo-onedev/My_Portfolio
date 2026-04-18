import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500 relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10 text-center flex flex-col items-center"
      >
        {/* Lottie Animation */}
        <div className="w-full max-w-[500px] h-auto mb-12 drop-shadow-2xl">
          <Player
            autoplay
            loop
            src="/animations/404.json"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Page introuvable</p>

        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all text-lg flex items-center group"
          >
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            {t('notfound.button')}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
