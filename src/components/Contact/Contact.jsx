import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Info section animation
      gsap.from(".contact-info > *", {
        scrollTrigger: {
          trigger: ".contact-info",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Form animation
      gsap.from(".contact-form", {
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await emailjs.send(
        'service_3b9vcr1',
        'template_f5mx4z2',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        'bSm71xxK7eIJgUVYK'
      );

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Error');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-32 bg-white dark:bg-[#121212] transition-colors duration-500 relative overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left side: Content */}
            <div className="contact-info lg:w-1/2">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-6 block">{t('contact.label')}</span>
              <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
                {t('contact.title1')} <br /><span className="gradient-text">{t('contact.title2')}</span> {t('contact.title3')}
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12 max-w-lg">
                {t('contact.description')}
              </p>

              <div className="space-y-8">
                <div className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xl shadow-primary/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{t('contact.emailLabel')}</h4>
                    <a href="mailto:bationojonathan5@gmail.com" className="text-gray-900 dark:text-white font-bold text-lg hover:text-primary transition-colors">bationojonathan5@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xl shadow-primary/5">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.934 11.934 0 001.576 6.091L0 24l6.135-1.61a11.889 11.889 0 005.912 1.569h.005c6.634 0 12.032-5.396 12.035-12.032a11.85 11.85 0 00-3.535-8.528" /></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{t('contact.whatsappLabel')}</h4>
                    <a href="https://wa.me/22664740266" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-bold text-lg hover:text-primary transition-colors">+226 64 74 02 66</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="contact-form lg:w-1/2">
              <div className="glass rounded-[2.5rem] p-8 md:p-12 border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden bg-gray-50/50 dark:bg-white/5 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-500 rounded-2xl text-center font-bold"
                  >
                    {t('contact.successMsg')}
                  </motion.div>
                )}

                {error && (
                  <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 rounded-2xl text-center font-bold">
                    {t('contact.errorMsg')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.formName')}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.formEmail')}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.formSubject')}
                      className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder={t('contact.formMessage')}
                      className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-6 text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all font-light resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] lg:hover:shadow-xl lg:hover:shadow-primary/20 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : t('contact.formSubmit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
