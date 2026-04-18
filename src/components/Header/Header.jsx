import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import { DarkModeContext } from '../../context/DarkModeContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: "/#hero", text: t('header.home') },
    { href: "/#projects", text: t('header.projects') },
    { href: "/#skills", text: t('header.skills') },
    { href: "/news", text: t('header.news') },
    { href: "/#contact", text: t('header.contact') }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
      <nav className={`container mx-auto px-6`}>
        <div className={`flex items-center justify-between mx-auto max-w-7xl glass px-8 py-4 rounded-full transition-all duration-300 border border-gray-100 dark:border-white/5 ${scrolled ? 'shadow-xl bg-white/80 dark:bg-black/80' : 'shadow-none'}`}>
          {/* Logo */}
          <Link to="/" className="text-2xl font-black gradient-text flex-shrink-0 tracking-tighter">
            J.FOLIO
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {menuItems.map((item, index) => (
              item.href.startsWith('/#') || item.href.startsWith('#') ? (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                >
                  {item.text}
                </Link>
              )
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full neumorph-button text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-lg shadow-black/5"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* CTA Button */}
            <a href="#contact" className="hidden lg:block px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
              {t('header.cta')}
            </a>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-900 dark:text-white"
              >
                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="md:hidden mt-4"
            >
              <div className="glass rounded-3xl p-6 flex flex-col space-y-4 shadow-2xl border border-gray-100 dark:border-white/5 bg-white/90 dark:bg-black/90">
                {menuItems.map((item, index) => (
                  item.href.startsWith('/#') || item.href.startsWith('#') ? (
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.text}
                    </Link>
                  )
                ))}
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <LanguageSwitcher />
                  <a href="#contact" className="px-6 py-2 rounded-full bg-primary text-white font-bold text-center">
                    {t('header.cta')}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
