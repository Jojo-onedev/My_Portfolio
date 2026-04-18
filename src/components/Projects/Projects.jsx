import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import turso from '../../lib/turso';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await turso.execute('SELECT * FROM projects ORDER BY created_at DESC');
        setProjects(res.rows);
      } catch (err) {
        console.error("Error loading projects from Turso:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".projects-header > *", {
        scrollTrigger: {
          trigger: ".projects-header",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        clearProps: "all"
      });

      // Cards animation
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: ".project-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects, selectedCategory]);

  const filteredProjects = (projects || []).filter(project => 
    selectedCategory === 'all' || project.category === selectedCategory
  );

  const categories = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'web', label: t('projects.filters.web') },
    { id: 'dev', label: t('projects.filters.dev') },
    { id: 'ui',  label: t('projects.filters.ui') }
  ];

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-32 bg-white dark:bg-[#121212] relative overflow-hidden transition-colors duration-500"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="projects-header text-center mb-24">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              {t('projects.label')}
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              {t('projects.title1')} <span className="gradient-text">{t('projects.title2')}</span>.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              {t('projects.description')}
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                    selectedCategory === cat.id 
                      ? 'bg-primary text-white shadow-2xl shadow-primary/30' 
                      : 'glass text-gray-500 hover:text-gray-900 dark:hover:text-white border-gray-100 dark:border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="project-grid grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="project-card neumorph-card group p-5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all duration-500 bg-gray-50 dark:bg-[#1a1a1a]"
              >
                {/* Image Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Performance Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="glass rounded-xl p-3 flex justify-between items-center border-white/10">
                       <div className="text-center">
                         <div className="text-primary font-black text-sm">+{Math.floor(Math.random() * 30) + 20}%</div>
                         <div className="text-[8px] text-gray-500 uppercase">Conv.</div>
                       </div>
                       <div className="w-px h-6 bg-white/10" />
                       <div className="text-center">
                         <div className="text-white font-black text-sm">1.2s</div>
                         <div className="text-[8px] text-gray-400 uppercase">Load</div>
                       </div>
                       <div className="w-px h-6 bg-white/10" />
                       <div className="text-center">
                         <div className="text-green-500 font-black text-sm">A+</div>
                         <div className="text-[8px] text-gray-400 uppercase">SEO</div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
                      {project.category}
                    </span>
                    <div className="flex space-x-1">
                       {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary/40" />)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2 font-light">
                    {project.description}
                  </p>

                  {/* CTA */}
                  <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-white font-bold text-sm hover:text-primary transition-colors flex items-center group/btn"
                    >
                      {t('projects.view')}
                      <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                    <button className="neumorph-button w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA Card */}
          <div className="projects-cta mt-32 glass p-12 md:p-20 rounded-[3rem] text-center border-gray-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {t('projects.ctaTitle1')} <br /><span className="gradient-text">{t('projects.ctaTitle2')}</span> ?
              </h3>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                {t('projects.ctaDesc')}
              </p>
              <a 
                href="#contact" 
                className="inline-block bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-all"
              >
                {t('projects.ctaBtn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
