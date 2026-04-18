import React, { useState, useEffect } from 'react';
import turso from '../../../lib/turso';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    avatar: ''
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
      setTestimonials(res.rows);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await turso.execute({
          sql: 'UPDATE testimonials SET name = ?, role = ?, quote = ?, avatar = ? WHERE id = ?',
          args: [formData.name, formData.role, formData.quote, formData.avatar, editingTestimonial.id]
        });
      } else {
        await turso.execute({
          sql: 'INSERT INTO testimonials (name, role, quote, avatar) VALUES (?, ?, ?, ?)',
          args: [formData.name, formData.role, formData.quote, formData.avatar]
        });
      }
      setIsModalOpen(false);
      setEditingTestimonial(null);
      setFormData({ name: '', role: '', quote: '', avatar: '' });
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce témoignage ?')) {
      try {
        await turso.execute({ sql: 'DELETE FROM testimonials WHERE id = ?', args: [id] });
        fetchTestimonials();
      } catch (err) { console.error(err); }
    }
  };

  const openModal = (t = null) => {
    if (t) {
      setEditingTestimonial(t);
      setFormData({ name: t.name, role: t.role, quote: t.quote, avatar: t.avatar });
    } else {
      setEditingTestimonial(null);
      setFormData({ name: '', role: '', quote: '', avatar: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Témoignages</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Gérez les retours de vos clients</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
          <PlusIcon className="w-5 h-5" />
          <span>Nouveau Témoignage</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement...</div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">Aucun témoignage</div>
        ) : testimonials.map((t) => (
          <div key={t.id} className="neumorph-card p-8 bg-gray-50 dark:bg-[#1a1a1a] flex flex-col relative group">
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(t)} className="p-2 glass rounded-lg text-gray-400 hover:text-blue-500"><PencilIcon className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 glass rounded-lg text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 italic font-light mb-6">"{t.quote}"</p>
            <div className="flex items-center space-x-4">
               {t.avatar && <img src={t.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt=""/>}
               <div>
                 <div className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight">{t.name}</div>
                 <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{t.role}</div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-xl neumorph-card p-12 bg-white dark:bg-[#1a1a1a]">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">{editingTestimonial ? 'Modifier' : 'Ajouter'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="Nom" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm"/>
                <input type="text" placeholder="Rôle (ex: CEO @ Startup)" required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm"/>
                <textarea placeholder="Témoignage" required rows="4" value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm"/>
                <input type="text" placeholder="Avatar URL (Optionnel)" value={formData.avatar} onChange={(e) => setFormData({...formData, avatar: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none text-sm"/>
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

export default TestimonialManager;
