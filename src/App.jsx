import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import News from './components/News/News';
import Testimonials from './components/Testimonials/Testimonials';

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
    <I18nextProvider i18n={i18n}>
      <DarkModeProvider>
        <Router>
          <div className="min-h-screen">
            <Suspense fallback={<Loader />}>
              <Header />
              
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <About />
                    <Projects />
                    <Skills />
                    <Testimonials />
                    <Contact />
                    <Footer />
                  </>
                } />
                <Route path="/news" element={<News />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </DarkModeProvider>
    </I18nextProvider>
  );
}

export default App;