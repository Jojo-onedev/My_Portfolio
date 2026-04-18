import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const seed = async () => {
  console.log('🌱 Stratégie de peuplement en cours...');

  try {
    // 1. Définir les réglages initiaux
    const settings = [
      { key: 'site_title', value: 'J.FOLIO' },
      { key: 'hero_title', value: 'Discover <br /><span class="gradient-text">Digital Art</span> & <br />Modern Web.' },
      { key: 'hero_subtitle', value: 'Je conçois des expériences numériques immersives alliant esthétique minimaliste et performances de pointe.' },
      { key: 'about_title', value: 'Transformez vos Défis en Croissance.' },
      { key: 'about_description', value: 'Je ne me contente pas de coder ; je conçois des solutions business qui génèrent des résultats mesurables.' },
      { key: 'contact_email', value: 'contact@example.com' }
    ];

    for (const s of settings) {
      await turso.execute({
        sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        args: [s.key, s.value]
      });
    }

    // 2. Ajouter quelques projets exemples
    const projects = [
      {
        title: "Pulse AI Platform",
        category: "web",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        description: "Plateforme SaaS d'analyse prédictive utilisant le machine learning.",
        link: "#"
      },
      {
        title: "Lumina Design System",
        category: "ui",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
        description: "Système de design modulaire et accessible pour les applications fintech.",
        link: "#"
      }
    ];

    for (const p of projects) {
      await turso.execute({
        sql: 'INSERT INTO projects (title, category, image, description, link) VALUES (?, ?, ?, ?, ?)',
        args: [p.title, p.category, p.image, p.description, p.link]
      });
    }

    // 3. Ajouter quelques témoignages exemples
    const testimonials = [
      {
        name: 'Rachid',
        role: 'Entrepreneur',
        quote: 'C\'est un plaisir de travailler avec Jonathan. Il est toujours disponible.',
        avatar: '/images/john.png'
      },
      {
        name: 'Nabil',
        role: 'Coach Business',
        quote: 'Toujours à l\'écoute et disponible. Son expertise technique a fait une différence.',
        avatar: '/images/jane.png'
      }
    ];

    for (const t of testimonials) {
      await turso.execute({
        sql: 'INSERT INTO testimonials (name, role, quote, avatar) VALUES (?, ?, ?, ?)',
        args: [t.name, t.role, t.quote, t.avatar]
      });
    }

    console.log('✅ Base de données initialisée avec succès !');
  } catch (err) {
    console.error('❌ Erreur de peuplement:', err);
  }
};

seed();
