import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'FR';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 px-4 py-2 glass border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
          {currentLang}
        </span>
        <svg 
          className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-40 glass border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-2 flex flex-col gap-1">
              <button 
                onClick={() => changeLanguage('fr')}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${currentLang === 'FR' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                Français (FR)
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${currentLang === 'EN' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                English (EN)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
