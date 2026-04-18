import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    password: '',
    username: '' // Honeypot field (hidden from users)
  });
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Bot Detection (Honeypot)
    if (formData.username) {
      console.warn('Bot detected');
      return; // Silent fail for bots
    }

    // 2. Brute-force Check (Rate Limiting)
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      setError(`Trop de tentatives. Réessayez dans ${remainingSeconds}s.`);
      return;
    }

    setIsLoading(true);

    // 3. Request Throttling (Artificial Delay)
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (login(formData.password)) {
      navigate('/admin/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setLockoutUntil(Date.now() + 30000); // 30s lockout
        setAttempts(0);
        setError('Accès bloqué pendant 30 secondes (trop d\'erreurs).');
      } else {
        setError('Identifiants invalides');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-[#121212] flex items-center justify-center p-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md neumorph-card p-12 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">Admin Access</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light text-sm uppercase tracking-widest">Maîtrisez votre présence numérique</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Honeypot field - Catch automated bots */}
          <div className="hidden" aria-hidden="true">
            <input 
              type="text" 
              name="username" 
              tabIndex="-1" 
              autoComplete="off"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 ml-1">Clé d'accès unique</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-[#f1f3f6] dark:bg-[#121212] border border-gray-100 dark:border-white/5 focus:border-primary/50 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="••••••••"
              disabled={isLoading || Date.now() < lockoutUntil}
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest bg-red-500/10 py-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={isLoading || Date.now() < lockoutUntil}
            className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            {isLoading ? 'Vérification...' : 'S\'authentifier'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
          <a href="/" className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.3em]">
            &larr; Retour au portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
