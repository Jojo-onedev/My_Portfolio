import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('about_title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src="/images/0C1A4133hhh.jpg" 
                alt="Jonathan BATIONO" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                {t('about_text')}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">BATIONO Jonathan</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Address:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Burkina Faso / Koudougou</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">bationojonathan5@gmail.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Phone:</span>
                  <span className="font-medium text-gray-900 dark:text-white">+226 64740266</span>
                </div>
              </div>

              <motion.a
                href="/myresume.pdf"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
              >
                {t('download_cv')}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;