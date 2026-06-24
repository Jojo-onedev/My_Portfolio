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
import { SpeedInsights } from '@vercel/speed-insights/react';

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
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    logVisit(location.pathname);

    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId);
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname });
    }
  }, [location.pathname, isReady]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
      </div>
    );
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
