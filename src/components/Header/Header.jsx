import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const menuItems = [
    { href: "#hero", text: t('nav_home') },
    { href: "#about", text: t('nav_about') },
    { href: "#projects", text: t('nav_projects') },
    { href: "#skills", text: t('nav_skills') },
    { href: "#testimonials", text: t('nav_testimonials') },
    { href: "/news", text: t('nav_news') },
    { href: "#contact", text: t('nav_contact') }
  ];

  return (
    <header className="fixed w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Logo à gauche */}
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white flex-shrink-0">
            J.Folio
          </Link>

          {/* Navigation desktop au centre */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          {/* Boutons à droite */}
          <div className="flex items-center space-x-2">
            {/* Language switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* Dark mode toggle */}
            <div className="hidden md:block">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isDarkMode ? t('switch_to_light') : t('switch_to_dark')}
              >
                {isDarkMode ? (
                  <SunIcon className="w-6 h-6 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
              >
                {isMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            >
              <motion.div 
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-lg"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Link 
                      to="/" 
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      J.Folio
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Fermer le menu"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
          
                  <div className="space-y-4 w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    {menuItems.map((item) => (
                      <a
                        key={item.text}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                      >
                        {item.text}
                      </a>
                    ))}
                    
                    <div className="flex items-center justify-between px-4 py-2">
                      <button 
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={isDarkMode ? t('switch_to_light') : t('switch_to_dark')}
                      >
                        {isDarkMode ? (
                          <SunIcon className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      
                      <div className="md:hidden">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
