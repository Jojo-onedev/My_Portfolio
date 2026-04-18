import React, { useState, useEffect } from 'react';
import turso from '../../../lib/turso';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, ExternalLinkIcon } from '@heroicons/react/outline';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    category: 'web'
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await turso.execute('SELECT * FROM projects ORDER BY created_at DESC');
      setProjects(res.rows);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await turso.execute({
          sql: 'UPDATE projects SET title = ?, description = ?, image = ?, link = ?, category = ? WHERE id = ?',
          args: [formData.title, formData.description, formData.image, formData.link, formData.category, editingProject.id]
        });
      } else {
        await turso.execute({
          sql: 'INSERT INTO projects (title, description, image, link, category) VALUES (?, ?, ?, ?, ?)',
          args: [formData.title, formData.description, formData.image, formData.link, formData.category]
        });
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', image: '', link: '', category: 'web' });
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await turso.execute({
          sql: 'DELETE FROM projects WHERE id = ?',
          args: [id]
        });
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        link: project.link,
        category: project.category
      });
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '', image: '', link: '', category: 'web' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Gestion des Projets</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Ajoutez ou modifiez vos réalisations en temps réel</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Projects Table/List */}
      <div className="neumorph-card overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-12 text-center text-gray-500">Chargement...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="4" className="p-12 text-center text-gray-500">Aucun projet trouvé</td></tr>
              ) : projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <img src={project.image} alt="" className="w-20 aspect-video object-cover rounded-lg bg-gray-200" />
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-gray-900 dark:text-white">{project.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{project.description}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                      {project.category}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => openModal(project)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tool */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl neumorph-card p-12 bg-white dark:bg-[#1a1a1a] max-h-screen overflow-y-auto"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">
                {editingProject ? 'Modifier le Projet' : 'Nouveau Projet'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Titre</label>
                    <input 
                      type="text" required
                      value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 focus:border-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                    <select 
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 outline-none transition-all text-sm"
                    >
                      <option value="web">Web Development</option>
                      <option value="ui">UI/UX Design</option>
                      <option value="dev">Software Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows="3" required
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 focus:border-primary/50 outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                  <input 
                    type="text" required
                    value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 focus:border-primary/50 outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lien du projet</label>
                  <input 
                    type="text"
                    value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 focus:border-primary/50 outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-white/5 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all">Annuler</button>
                  <button type="submit" className="flex-1 py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManager;
