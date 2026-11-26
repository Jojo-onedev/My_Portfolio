import React, { useState, useEffect, useRef } from 'react';
import { SaveIcon } from '@heroicons/react/outline';

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMounted = useRef(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (isMounted.current) setSettings(data.settings || {});
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
    return () => { isMounted.current = false; };
  }, []);

  const handleUpdate = (_key, value) => {
    setSettings(prev => ({ ...prev, [_key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Paramètres enregistrés avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des réglages...</div>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Configuration Générale</h1>
        <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Personnalisez les informations globales du site</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        <div className="neumorph-card p-10 bg-gray-50 dark:bg-[#1a1a1a] space-y-8">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Titre du Site</label>
             <input 
               type="text" 
               value={settings.site_title || ''} 
               onChange={(e) => handleUpdate('site_title', e.target.value)}
               className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hero Title (HTML supporté)</label>
             <textarea 
               rows="2"
               value={settings.hero_title || ''} 
               onChange={(e) => handleUpdate('hero_title', e.target.value)}
               className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
             <textarea 
               rows="2"
               value={settings.hero_subtitle || ''} 
               onChange={(e) => handleUpdate('hero_subtitle', e.target.value)}
               className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">About Title</label>
             <input 
               type="text" 
               value={settings.about_title || ''} 
               onChange={(e) => handleUpdate('about_title', e.target.value)}
               className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">About Description</label>
             <textarea 
               rows="3"
               value={settings.about_description || ''} 
               onChange={(e) => handleUpdate('about_description', e.target.value)}
               className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all"
             />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center space-x-4 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 hover:scale-105 transition-all disabled:opacity-50"
        >
          <SaveIcon className="w-5 h-5" />
          <span>{saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
        </button>
      </form>
    </div>
  );
};

export default SettingsManager;