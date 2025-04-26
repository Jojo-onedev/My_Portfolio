import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      role: 'Senior Developer',
      company: 'TechCorp',
      quote: 'Jonathan est un développeur exceptionnel avec une excellente compréhension des meilleures pratiques. Son travail est toujours de haute qualité.',
      image: '/images/john.png'
    },
    {
      name: 'Jane Smith',
      role: 'Project Manager',
      company: 'WebSolutions',
      quote: 'Travailler avec Jonathan a été un véritable plaisir. Il est très professionnel et livre toujours ses projets dans les délais.',
      image: '/images/jane.png'
    },
    {
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      company: 'DesignLab',
      quote: 'Jonathan a une excellente vision technique et sait transformer des idées en produits réels. Je recommande vivement ses services.',
      image: '/images/mike.png'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here are some thoughts from satisfied clients
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="relative mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto"
                />
                {/* <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800"></div> */}
              </div>
              
              <blockquote className="text-gray-600 dark:text-gray-300 mb-4">
                <p className="text-lg italic">{testimonial.quote}</p>
              </blockquote>
              
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                <p className="text-gray-500 dark:text-gray-400">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;