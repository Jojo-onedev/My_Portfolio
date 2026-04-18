import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import turso from '../../lib/turso';
import SEO from '../SEO/SEO';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Hero = () => {
  const [settings, setSettings] = useState({});
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await turso.execute('SELECT * FROM settings');
        const settingsMap = {};
        res.rows.forEach(row => {
          settingsMap[row.key] = row.value;
        });
        setSettings(settingsMap);
      } catch (err) {
        console.error("Hero settings fetch error:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Typing animation for the title
      const titleText = "Bationo Jonathan, architect digital";
      const titleElement = titleRef.current;
      
      if (titleElement) {
        tl.to(titleElement, {
          duration: 2.5,
          text: titleText,
          ease: "none",
          delay: 0.5
        });
      }

      tl.from(textRef.current, {
        y: 30,
        opacity: 0,
        duration: 1
      }, "-=0.2")
        .from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 1
        }, "-=0.8")
        .from(statsRef.current, {
          y: 50,
          opacity: 0,
          duration: 1
        }, "-=0.6");

      // Background elements floating animation
      gsap.to(".bg-accent", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden bg-white dark:bg-[#121212] transition-colors duration-500"
    >
      <SEO
        description={isEnglish ? t('hero.subtitle') : ((settings && settings.hero_subtitle) || t('hero.subtitle'))}
        keywords="Jonathan BATIONO, développeur web, designer, portfolio, react, developpement web"
      />
      {/* Dynamic Background Elements */}
      <div className="bg-accent absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="bg-accent absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text Content */}
          <div className="flex-1 text-left">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-6 block"
            >
              {t('hero.role')}
            </motion.span>

            <h1
              ref={titleRef}
              className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tighter min-h-[1.1em]"
            >
              {/* Text will be typed here */}
            </h1>
            <span className="cursor-blink inline-block w-2 H-[0.8em] bg-primary ml-2 align-middle" />

            <p
              ref={textRef}
              className="text-xl text-gray-400 dark:text-gray-400 max-w-xl mb-10 leading-relaxed font-light"
            >
              {isEnglish ? t('hero.subtitle') : ((settings && settings.hero_subtitle) || t('hero.subtitle'))}
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="px-10 py-5 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/20 hover:bg-opacity-90 transition-all text-lg"
              >
                {t('hero.projects')}
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#contact"
                className="px-10 py-5 rounded-2xl border border-gray-200 dark:border-white/10 glass text-gray-800 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-lg flex items-center group"
              >
                {t('hero.contact')}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </motion.a>
            </div>
          </div>

          {/* Main Visual / Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-[500px] relative mt-16 lg:mt-0"
          >
            {/* Offset Wireframe Border (Architectural element) */}
            <div className="absolute top-6 bottom-0 -right-6 lg:-right-10 w-full h-full border-b border-r border-gray-300 dark:border-white/20 rounded-b-[4rem] z-0 hidden lg:block" />
            
            {/* Main Arch Shape */}
            <div className="relative z-10 w-full max-w-[450px] mx-auto h-[450px] sm:h-[500px] lg:h-[600px] rounded-t-[15rem] rounded-b-[4rem] overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] shadow-2xl shadow-black/10 group cursor-pointer border border-white/10">
              {/* Image with Grayscale hover effect */}
              <img 
                className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 grayscale hover:grayscale-0 transition-all duration-700 ease-out" 
                src="/images/myimage.jpg" 
                alt="Jonathan Bationo" 
              />
              {/* Inner vignette/shadow for depth */}
              <div className="absolute inset-0 shadow-[inset_0_-50px_100px_rgba(0,0,0,0.5)] opacity-50 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Floating Availability Badge */}
            <div className="absolute bottom-12 lg:bottom-24 -left-4 lg:-left-12 z-20 bg-white dark:bg-[#1a1a1a] rounded-full px-6 py-4 flex items-center gap-4 border border-gray-100 dark:border-white/10 shadow-2xl">
               <div className="relative flex items-center justify-center w-3 h-3">
                 <div className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
                 <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
                 {t('hero.availability')}
               </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats Horizontal Bar */}
        <div
          ref={statsRef}
          className="mt-20 glass rounded-[2rem] p-8 md:p-12 flex flex-wrap justify-between items-center gap-8 border-gray-100 dark:border-white/5"
        >
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-1">{t('hero.clients')}</span>
            <span className="text-gray-900 dark:text-white text-4xl font-black">5+</span>
          </div>
          <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-1">{t('hero.realized')}</span>
            <span className="text-gray-900 dark:text-white text-4xl font-black">5+</span>
          </div>
          <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-1">{t('hero.experience')}</span>
            <span className="text-gray-900 dark:text-white text-4xl font-black">3+</span>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#121212] bg-gray-600" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

