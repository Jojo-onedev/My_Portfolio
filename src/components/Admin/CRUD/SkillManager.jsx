import React, { useState, useEffect } from 'react';
import turso from '../../../lib/turso';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';

const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermédiaire',
    category: 'tech',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'hover:border-primary/40'
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await turso.execute('SELECT * FROM skills ORDER BY created_at DESC');
      setSkills(res.rows);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await turso.execute({
          sql: 'UPDATE skills SET name = ?, level = ?, category = ?, color = ?, bg = ?, border = ? WHERE id = ?',
          args: [formData.name, formData.level, formData.category, formData.color, formData.bg, formData.border, editingSkill.id]
        });
      } else {
        await turso.execute({
          sql: 'INSERT INTO skills (name, level, category, color, bg, border) VALUES (?, ?, ?, ?, ?, ?)',
          args: [formData.name, formData.level, formData.category, formData.color, formData.bg, formData.border]
        });
      }
      setIsModalOpen(false);
      setEditingSkill(null);
      setFormData({ name: '', level: 'Intermédiaire', category: 'tech', color: 'text-primary', bg: 'bg-primary/5', border: 'hover:border-primary/40' });
      fetchSkills();
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette compétence ?')) {
      try {
        await turso.execute({ sql: 'DELETE FROM skills WHERE id = ?', args: [id] });
        fetchSkills();
      } catch (err) { console.error(err); }
    }
  };

  const openModal = (s = null) => {
    if (s) {
      setEditingSkill(s);
      setFormData({ name: s.name, level: s.level, category: s.category, color: s.color, bg: s.bg, border: s.border });
    } else {
      setEditingSkill(null);
      setFormData({ name: '', level: 'Intermédiaire', category: 'tech', color: 'text-primary', bg: 'bg-primary/5', border: 'hover:border-primary/40' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Compétences Backend</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Gérez votre pile technologique</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
          <PlusIcon className="w-5 h-5" />
          <span>Nouvelle Compétence</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement...</div>
        ) : skills.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">Aucune compétence</div>
        ) : skills.map((s) => (
          <div key={s.id} className="neumorph-card p-6 bg-gray-50 dark:bg-[#1a1a1a] flex flex-col items-center text-center relative group">
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(s)} className="p-2 text-gray-400 hover:text-blue-500"><PencilIcon className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <span className={`text-2xl font-black ${s.color}`}>{s.name.charAt(0)}</span>
            </div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-tight mb-2">{s.name}</h4>
            <div className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-current ${s.color} opacity-60`}>
              {s.level}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg neumorph-card p-12 bg-white dark:bg-[#1a1a1a]">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">{editingSkill ? 'Modifier' : 'Ajouter'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nom de la compétence" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm"/>
                
                <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm">
                  <option value="Expert">Expert</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Débutant">Débutant</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Couleur Texte (Tailwind)" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-[10px]"/>
                  <input type="text" placeholder="Couleur BG (Tailwind)" value={formData.bg} onChange={(e) => setFormData({...formData, bg: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-[10px]"/>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/5 rounded-xl">Annuler</button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 rounded-xl">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillManager;
