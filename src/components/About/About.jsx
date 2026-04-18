import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { faArrowRight, faRocket, faBuilding, faUserTie, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import turso from '../../lib/turso';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [settings, setSettings] = useState({});
  const sectionRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const challenges = t('about.challenges', { returnObjects: true });
  const solutions = t('about.solutions', { returnObjects: true });

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
        console.error("About settings fetch error:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // General section reveals
      gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Challenges animation
      gsap.from(".challenge-item", {
        scrollTrigger: {
          trigger: ".challenges-wrapper",
          start: "top 70%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all"
      });

      // Solutions animation
      gsap.from(".solution-item", {
        scrollTrigger: {
          trigger: ".solutions-wrapper",
          start: "top 70%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all"
      });

      // Audience CTA animation
      gsap.from(".audience-item", {
        scrollTrigger: {
          trigger: ".audience-section",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        clearProps: "all"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-32 bg-[#f1f3f6] dark:bg-[#121212] transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-32 reveal-text">
            <span className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
              {t('about.visionLabel')}
            </span>
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.95]">
              {isEnglish ? t('about.title') : ((settings && settings.about_title) || t('about.title'))}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl font-medium leading-tight">
              {isEnglish ? t('about.description') : ((settings && settings.about_description) || t('about.description'))}
            </p>
          </div>

          {/* Split Layout: Challenges */}
          <div className="flex flex-col lg:flex-row gap-16 mb-40 challenges-wrapper relative">
            <div className="lg:w-5/12 lg:sticky lg:top-32 h-fit mb-12 lg:mb-0 z-10">
              <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-[0.7rem] mb-4 block">{t('about.problemsLabel')}</span>
              <h3 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                {t('about.problemsTitle1')} <br/><span className="text-red-500">{t('about.problemsTitle2')}</span>
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm">
                {t('about.problemsDesc')}
              </p>
            </div>
            
            <div className="lg:w-7/12 space-y-24 mt-8 lg:mt-0">
              {Array.isArray(challenges) && challenges.map((item, i) => (
                <div key={i} className="challenge-item relative pl-8 md:pl-16">
                  <div className="text-[10rem] md:text-[14rem] leading-none font-black text-gray-200/50 dark:text-white/[0.03] absolute -top-12 md:-top-20 -left-4 md:-left-8 -z-10 tracking-tighter select-none">
                    0{i + 1}
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{item.title}</h4>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-normal leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Split Layout: Solutions */}
          <div className="flex flex-col lg:flex-row-reverse gap-16 mb-40 solutions-wrapper relative">
            <div className="lg:w-5/12 lg:sticky lg:top-32 h-fit mb-12 lg:mb-0 z-10 lg:text-right">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-[0.7rem] mb-4 block">{t('about.approachLabel')}</span>
              <h3 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                {t('about.approachTitle1')} <br/><span className="text-primary">{t('about.approachTitle2')}</span>
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-sm lg:ml-auto">
                {t('about.approachDesc')}
              </p>
            </div>
            
            <div className="lg:w-7/12 space-y-24 mt-8 lg:mt-0">
              {Array.isArray(solutions) && solutions.map((item, i) => (
                <div key={i} className="solution-item relative pl-8 md:pl-16">
                  <div className="text-[10rem] md:text-[14rem] leading-none font-black text-gray-200/50 dark:text-white/[0.03] absolute -top-12 md:-top-20 -left-4 md:-left-8 -z-10 tracking-tighter select-none">
                    0{i + 1}
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{item.title}</h4>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-normal leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Audience / Full Width minimal */}
          <div className="audience-section border-t border-gray-300 dark:border-white/10 pt-20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-16 uppercase tracking-[0.2em] text-center">
              {t('about.audienceLabel')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 mb-24">
              {[
                { icon: faRocket, key: 'startups' },
                { icon: faBuilding, key: 'pme' },
                { icon: faUserTie, key: 'entrepreneurs' },
                { icon: faShoppingCart, key: 'ecommerce' }
              ].map((item, index) => (
                <div key={index} className="audience-item flex flex-col items-center">
                  <div className="text-4xl text-primary mb-6">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t(`about.audiences.${item.key}`)}</h4>
                </div>
              ))}
            </div>
            
            <div className="text-center reveal-text">
              <a
                href="#contact"
                className="inline-flex items-center space-x-6 text-2xl font-black uppercase tracking-widest text-primary hover:text-red-600 transition-colors group"
              >
                <span>{t('about.cta')}</span>
                <span className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary z-10 group-hover:text-white transition-all transform group-hover:translate-x-4">
                  <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
