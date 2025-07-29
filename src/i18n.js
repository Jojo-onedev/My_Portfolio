import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Les traductions
const resources = {
  en: {
    translation: {
      // Navigation
      nav_home: "Home",
      nav_about: "About",
      nav_projects: "Projects",
      nav_skills: "Skills",
      nav_testimonials: "Testimonials",
      nav_news: "News",
      nav_contact: "Contact",
      
      // Hero section
      hero_title: "Hi, I'm Jonathan",
      hero_subtitle: "Junior Web Developer",
      hero_cta1: "Hire Me",
      hero_cta2: "Contact Me",
      
      // About section
      about_title: "About Me",
      download_cv: "Download my CV",
      about_text: "I'm a passionate web developer with experience in creating modern web applications and mobile apps. My goal is to deliver high-quality solutions that meet the needs of my clients. I am always eager to learn and improve my skills, and I love collaborating with others to bring ideas to life.",
      
      // Projects section
      projects_title: "My Projects",
      view_project: "View Project",
      
      // Contact section
      contact_title: "Get In Touch",
      contact_name: "Your Name",
      contact_email: "Your Email",
      contact_message: "Your Message",
      contact_send: "Send Message",
      contact_success: "Message sent successfully!",
      contact_success_details: "I will get back to you as soon as possible.",
      contact_error: "Error sending message. Please try again.",
      sending: "Sending...",
      contact_description: "I would love to hear from you! Whether you have a question, a project in mind, or just want to say hello, feel free to reach out using the form below or directly via email or phone.",
      
      // Testimonials
      testimonials_title: "What Clients Say",
      testimonials_subtitle: "Here are some thoughts from satisfied clients",
      testimonial1_role: "Senior Developer",
      testimonial1_quote: "Jonathan is an exceptional developer with an excellent understanding of best practices. His work is always of high quality.",
      testimonial2_role: "Project Manager",
      testimonial2_quote: "Working with Jonathan was a real pleasure. He is very professional and always delivers his projects on time.",
      testimonial3_role: "UI/UX Designer",
      testimonial3_quote: "Jonathan has excellent technical vision and knows how to turn ideas into real products. I highly recommend his services.",
      
      // Footer
      footer_about: "I am a passionate web developer with a focus on creating beautiful and functional web applications. My goal is to deliver high-quality solutions that meet the needs of my clients. I am always eager to learn and improve my skills, and I love collaborating with others to bring ideas to life.",
      footer_quick_links: "Quick Links",
      all_rights_reserved: "All rights reserved.",
      
      // News
      news_title: "Latest Tech News",
      news_subtitle: "Stay updated with the latest news in web development and technology",
      news_refresh: "Refresh News",
      news_error_loading: "Error loading news. Please try again.",
      share_article: "Share article",
      read_more: "Read more",
      loading: "Loading...",
      locale: "en-US",

      // Skills
      skills_title: "Skills",

      // Language switcher
      language: "Language",
      en: "English",
      fr: "Français",
      switch_to_light: "Switch to light mode",
      switch_to_dark: "Switch to dark mode"
    }
  },
  fr: {
    translation: {
      // Navigation
      nav_home: "Accueil",
      nav_about: "À propos",
      nav_projects: "Projets",
      nav_skills: "Compétences",
      nav_testimonials: "Témoignages",
      nav_news: "Actualités",
      nav_contact: "Contact",
      
      // Hero section
      hero_title: "Bonjour, je suis Jonathan",
      hero_subtitle: "Développeur Web Junior",
      hero_cta1: "Me recruter",
      hero_cta2: "Me contacter",
      
      // About section
      about_title: "À propos de moi",
      download_cv: "Télécharger mon CV",
      about_text: "Je suis un développeur web passionné avec de l'expérience dans la création d'applications web et mobiles modernes. Mon objectif est de fournir des solutions de haute qualité qui répondent aux besoins de mes clients. Je suis toujours désireux d'apprendre et d'améliorer mes compétences, et j'adore collaborer avec les autres pour donner vie aux idées.",
      
      // Projects section
      projects_title: "Mes Projets",
      view_project: "Voir le projet",
      
      // Contact section
      contact_title: "Contactez-moi",
      contact_name: "Votre nom",
      contact_email: "Votre email",
      contact_message: "Votre message",
      contact_send: "Envoyer le message",
      contact_success: "Message envoyé avec succès !",
      contact_success_details: "Je vous répondrai dans les plus brefs délais.",
      contact_error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      sending: "Envoi en cours...",
      contact_description: "J'aimerais beaucoup avoir de vos nouvelles ! Que vous ayez une question, un projet en tête ou que vous souhaitiez simplement dire bonjour, n'hésitez pas à me contacter en utilisant le formulaire ci-dessous ou directement par email ou téléphone.",
      
      // Testimonials
      testimonials_title: "Ce qu'en disent mes clients",
      testimonials_subtitle: "Quelques témoignages de clients satisfaits",
      testimonial1_role: "Développeur Senior",
      testimonial1_quote: "Jonathan est un développeur exceptionnel avec une excellente compréhension des bonnes pratiques. Son travail est toujours de haute qualité.",
      testimonial2_role: "Chef de Projet",
      testimonial2_quote: "Travailler avec Jonathan a été un réel plaisir. Il est très professionnel et livre toujours ses projets dans les temps.",
      testimonial3_role: "Designer UI/UX",
      testimonial3_quote: "Jonathan a une excellente vision technique et sait comment transformer les idées en produits concrets. Je recommande vivement ses services.",
      
      // Footer
      footer_about: "Je suis un développeur web passionné qui se concentre sur la création d'applications web belles et fonctionnelles. Mon objectif est de fournir des solutions de haute qualité qui répondent aux besoins de mes clients. Je suis toujours désireux d'apprendre et d'améliorer mes compétences, et j'adore collaborer avec les autres pour donner vie aux idées.",
      footer_quick_links: "Liens rapides",
      all_rights_reserved: "Tous droits réservés.",

      // Skills
      skills_title: "Compétences",
      
      
      // News
      news_title: "Dernières actualités tech",
      news_subtitle: "Restez informé des dernières actualités en développement web et technologie",
      news_refresh: "Actualiser les actualités",
      news_error_loading: "Erreur lors du chargement des actualités. Veuillez réessayer.",
      share_article: "Partager l'article",
      read_more: "Lire la suite",
      loading: "Chargement...",
      locale: "fr-FR",
      
      // Language switcher
      language: "Langue",
      en: "Anglais",
      fr: "Français",
      switch_to_light: "Passer en mode clair",
      switch_to_dark: "Passer en mode sombre"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
