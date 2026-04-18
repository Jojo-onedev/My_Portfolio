import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { I18nextProvider } from 'react-i18next';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Testimonials from './components/Testimonials/Testimonials';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CustomCursor from './components/Cursor/CustomCursor';
import { Analytics } from '@vercel/analytics/react';

// Lazy Loaded Routes (Code Splitting)
const News = React.lazy(() => import('./components/News/News'));
const NotFound = React.lazy(() => import('./components/NotFound/NotFound'));
const AdminLogin = React.lazy(() => import('./components/Admin/Login/AdminLogin'));
const AdminLayout = React.lazy(() => import('./components/Admin/Layout/AdminLayout'));
const ProtectedRoute = React.lazy(() => import('./components/Admin/ProtectedRoute'));
const Dashboard = React.lazy(() => import('./components/Admin/Dashboard/Dashboard'));
const ProjectManager = React.lazy(() => import('./components/Admin/CRUD/ProjectManager'));
const TestimonialManager = React.lazy(() => import('./components/Admin/CRUD/TestimonialManager'));
const SettingsManager = React.lazy(() => import('./components/Admin/CRUD/SettingsManager'));
const SkillManager = React.lazy(() => import('./components/Admin/CRUD/SkillManager'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { logVisit } from './utils/analytics';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // Log visit on route change (Custom Dashboard)
    if (!isLoading) {
      logVisit(location.pathname);
    }

    // Google Analytics Integration
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && !isLoading) {
      // 1. Inject gtag.js script
      if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', gaId);
      }
      
      // 2. Log Page View to GA
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
      });
    }
  }, [location.pathname, isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-[#121212] transition-colors duration-500">
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Helmet>
      <CustomCursor />
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <About />
              <Projects />
              <Skills />
              <Testimonials />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/news" element={<><Header /><News /><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="testimonials" element={<TestimonialManager />} />
              <Route path="skills" element={<SkillManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
    </div>
  );
}

export default App;