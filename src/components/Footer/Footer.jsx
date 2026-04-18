import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Jojo-onedev', icon: faGithub },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jonathan-bationo-7908b3348', icon: faLinkedin },
    { name: 'Facebook', url: 'https://www.facebook.com/jonathanba.bationo', icon: faFacebook }
  ];

  return (
    <footer className="bg-white dark:bg-[#121212] transition-colors duration-500 pt-32 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          {/* Main Footer Block */}
          <div className="glass rounded-[3rem] p-10 md:p-16 border-gray-100 dark:border-white/5 mb-20 relative overflow-hidden bg-gray-50/50 dark:bg-white/5 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32" />
            
            <div className="grid lg:grid-cols-4 gap-16 relative z-10">
              {/* Brand Col */}
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">
                  Jonathan<span className="text-primary">.</span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-light text-lg leading-relaxed mb-10 max-w-md transition-colors">
                  {t('footer.desc')}
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-primary transition-all duration-300 shadow-lg shadow-black/5"
                    >
                      <FontAwesomeIcon icon={link.icon} className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Col */}
              <div>
                <h4 className="text-gray-400 dark:text-white font-black uppercase tracking-widest text-sm mb-8 opacity-50">{t('footer.nav')}</h4>
                <ul className="space-y-4">
                  {['Hero', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-light text-lg">
                        {item === 'Hero' ? t('header.home') : item === 'About' ? t('header.about') : t(`header.${item.toLowerCase()}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Col */}
              <div>
                <h4 className="text-gray-400 dark:text-white font-black uppercase tracking-widest text-sm mb-8 opacity-50">{t('footer.contact')}</h4>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group">
                    <FontAwesomeIcon icon={faEnvelope} className="text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-gray-500 dark:text-gray-400 font-light truncate">bationojonathan5@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <FontAwesomeIcon icon={faPhone} className="text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-gray-500 dark:text-gray-400 font-light">+226 64 74 02 66</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-gray-500 dark:text-gray-400 font-light">Burkina Faso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center px-10 text-gray-400 dark:text-gray-500 text-sm font-light">
            <p>&copy; {currentYear} Jonathan Bationo. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
