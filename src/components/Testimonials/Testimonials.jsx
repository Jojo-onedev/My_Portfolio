import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import turso from '../../lib/turso';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
        setTestimonials(res.rows);
      } catch (err) {
        console.error("Testimonials fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-32 bg-white dark:bg-[#121212] transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              {t('testimonials.label')}
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              {t('testimonials.title1')} <span className="gradient-text">{t('testimonials.title2')}</span>.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              {t('testimonials.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {(testimonials || []).map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="neumorph-card p-10 flex flex-col h-full hover:border-primary/20 transition-colors group bg-gray-50 dark:bg-[#1e1e1e]"
              >
                {/* Quote Icon */}
                <div className="text-primary/20 text-6xl font-serif leading-none mb-6 group-hover:text-primary/50 transition-colors">“</div>
                
                <blockquote className="flex-grow mb-10">
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-light leading-relaxed italic transition-colors">
                    {t.quote}
                  </p>
                </blockquote>

                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 glass rounded-2xl p-1 border-gray-200 dark:border-white/10 shadow-xl shadow-black/5 transition-colors">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-black uppercase tracking-tight transition-colors">{t.name}</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;