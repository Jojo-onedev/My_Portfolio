import React, { useState, useEffect, useRef } from 'react';
import turso from '../../lib/turso';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMoneyBill, faRecycle, faPhone, faSearch, faPalette, faBolt, faRocket } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const [fetchingSkills, setFetchingSkills] = useState(true);
  const { t } = useTranslation();

  const fetchSkills = async () => {
    try {
      const res = await turso.execute('SELECT * FROM skills ORDER BY id ASC');
      setSkills(res.rows);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setFetchingSkills(false);
    }
  };

  const stepIcons = [faSearch, faPalette, faBolt, faRocket];
  const guaranteeIcons = [<FontAwesomeIcon icon={faClock} />, <FontAwesomeIcon icon={faMoneyBill} />, <FontAwesomeIcon icon={faRecycle} />, <FontAwesomeIcon icon={faPhone} />];

  const stepsTranslations = t('skills.steps', { returnObjects: true });
  const guaranteesTranslations = t('skills.guarantees', { returnObjects: true });

  const processSteps = Array.isArray(stepsTranslations) ? stepsTranslations.map((step, idx) => ({
    number: `0${idx + 1}`,
    title: step.title,
    description: step.desc,
    duration: step.duration,
    icon: stepIcons[idx]
  })) : [];

  const guarantees = Array.isArray(guaranteesTranslations) ? guaranteesTranslations.map((g, idx) => ({
    icon: guaranteeIcons[idx],
    title: g.title,
    description: g.desc
  })) : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline items animation
      gsap.from(".process-step", {
        scrollTrigger: {
          trigger: ".process-timeline",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all"
      });

      // Bottom bar items
      gsap.from(".guarantee-item", {
        scrollTrigger: {
          trigger: ".guarantees-bar",
          start: "top 95%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all"
      });
    }, sectionRef);

    fetchSkills();

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-32 bg-white dark:bg-[#121212] transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Expertise Technique - NEW SECTION */}
          <div className="mb-40">
            <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                {t('skills.stackLabel')}
              </span>
              <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">
                {t('skills.expertise1')} <span className="gradient-text">{t('skills.expertise2')}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {fetchingSkills ? (
                <div className="col-span-full text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">{t('skills.loadingStack')}</div>
              ) : skills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className={`skill-tile group p-8 glass rounded-[2.5rem] border border-gray-100 dark:border-white/5 ${skill.bg} ${skill.border} transition-all duration-500 relative flex flex-col items-center justify-center text-center`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${skill.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <span className={`text-4xl font-black ${skill.color}`}>{skill.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-lg mb-2">{skill.name}</h4>
                  <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-current ${skill.color} opacity-60`}>
                    {skill.level}
                  </div>
                  
                  {/* Glowing background on hover */}
                  <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 rounded-full ${skill.bg}`} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ma Méthodologie - Shifted Below */}
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              {t('skills.methodologyLabel')}
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              {t('skills.effectiveness1')} <span className="gradient-text">{t('skills.effectiveness2')}</span>.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              {t('skills.methodologyDesc')}
            </p>
          </div>

          {/* Process Timeline */}
          <div className="process-timeline relative mb-32">
            {/* Center Line Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 dark:bg-white/5" />
            
            <div className="space-y-20 md:space-y-0">
              {processSteps.map((step, index) => (
                <div key={index} className={`process-step flex flex-col md:flex-row items-center gap-10 md:gap-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="w-full md:w-1/2 flex justify-center md:px-10">
                    <div className="neumorph-card p-10 w-full hover:border-primary/20 border border-gray-100 dark:border-white/5 transition-colors group bg-gray-50 dark:bg-[#1a1a1a]">
                      <div className="flex items-center space-x-6 mb-6">
                        <span className="text-5xl font-black text-primary/10 dark:text-primary/20 group-hover:text-primary transition-colors uppercase tracking-tighter">{step.number}</span>
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-2xl text-primary shadow-lg shadow-primary/5">
                          <FontAwesomeIcon icon={step.icon} />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">{step.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-6">{step.description}</p>
                      <div className="inline-flex items-center px-4 py-2 rounded-full glass border-gray-100 dark:border-white/5 text-[10px] font-bold text-primary uppercase tracking-widest">
                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {t('skills.duration')} {step.duration}
                      </div>
                    </div>
                  </div>
                  
                  {/* Circle Dot */}
                  <div className="hidden md:flex relative z-10 w-12 h-12 bg-white dark:bg-[#121212] border-2 border-gray-100 dark:border-white/5 rounded-full items-center justify-center transition-colors">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(135,26,26,0.5)]" />
                  </div>
                  
                  <div className="w-full md:w-1/2" />
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees Bar */}
          <div className="guarantees-bar glass rounded-[3rem] p-10 md:p-16 border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {guarantees.map((g, i) => (
                <div key={i} className="guarantee-item flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="text-primary text-3xl mb-6">{g.icon}</div>
                  <h4 className="text-gray-900 dark:text-white font-black text-lg mb-2 uppercase tracking-tight">{g.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;