import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import { DarkModeContext } from '../../context/DarkModeContext';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", text: "Home" },
    { href: "#about", text: "About" },
    { href: "#projects", text: "Projects" },
    { href: "#skills", text: "Skills" },
    { href: "#testimonials", text: "Testimonials" },
    { href: "/news", text: "Actualités" },
    { href: "#contact", text: "Contact" }
  ];

  return (
    <header className="fixed w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          J.Folio
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <a
              key={item.text}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {item.text}
            </a>
          ))}
        </div>

        {/* Dark mode toggle - visible only on desktop */}
        <div className="md:flex hidden">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-500" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-gray-800 dark:text-white"
                >
                  J.Folio
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
        
              <div className="space-y-4 w-full bg-gray-100 dark:bg-gray-800 transition-all">
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
                
                {/* Dark mode toggle - visible only on mobile */}
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;