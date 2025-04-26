import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import News from './components/News/News';
import { useEffect, useState } from 'react';
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
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen">
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
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;