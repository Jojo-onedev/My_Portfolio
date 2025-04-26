import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/Jojo-onedev',
      icon: faGithub
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jonathan-bationo-7908b3348',
      icon: faLinkedin
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/jonathanba.bationo',
      icon: faFacebook
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Jonathan</h3>
              <p className="text-gray-400 mb-4">
                Développeur Web passionné et créatif, spécialisé dans la création d'applications web modernes et responsives.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={link.icon} size="lg" />
                    </motion.div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Me</h4>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> bationojonathan5@gmail.com
                </p>
                <p className="text-gray-400">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" /> +226 64 74 02 66
                </p>
                <p className="text-gray-400">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Koudougou, Burkina Faso
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {currentYear} Jonathan. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;