import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RefreshIcon, ShareIcon } from '@heroicons/react/outline';
import SEO from '../SEO/SEO';

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchNews = useCallback(async (newPage = 1) => {
    if (loading && newPage === 1) return; // Prevent multiple initial loads
    setLoading(true);
    setError(null);
    try {
      const tags = ['javascript', 'react', 'webdev'];
      const filteredTags = selectedCategory === 'all' ? tags : [selectedCategory];
      const results = [];
      for (const tag of filteredTags) {
        try {
          const response = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=3&page=${newPage}`);
          if (!response.ok) {
            if (response.status === 429) { await delay(1000); continue; }
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();
          results.push(...data);
          await delay(300);
        } catch (err) { console.error(err); continue; }
      }
      const newArticles = results.map((article, index) => ({
        ...article,
        uniqueId: `${article.id}_${index}_${newPage}`
      }));
      if (newPage === 1) setNews(newArticles);
      else setNews(prev => [...prev, ...newArticles]);
      setHasMore(newArticles.length > 0);
    } catch (err) {
      setError(t('news_error_loading') || 'Erreur lors du chargement des actualités');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]); // Removed 't' to prevent re-creation loops

  const handleRefresh = useCallback(() => {
    setPage(1);
    fetchNews(1);
  }, [fetchNews]);

  const handleShare = useCallback((url) => {
    if (navigator.share) {
      navigator.share({ title: document.title, url }).catch(console.error);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(t('link_copied'));
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    if (active) {
      fetchNews(1);
    }
    return () => { active = false; };
  }, [selectedCategory, fetchNews]);

  return (
    <section className="py-32 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500 overflow-hidden">
      <SEO 
        title="Actualités & Veille"
        description="Suivez mes dernières découvertes et articles sur le développement web, le design et les nouvelles technologies."
        keywords="blog webdev, actualités tech, veille technologique, Jonathan BATIONO"
      />
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
              Veille Technologique
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              Actualités & <span className="gradient-text">Insights</span>.
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Rester à la pointe de l'innovation pour vous offrir les solutions les plus performantes.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="flex flex-wrap gap-3 justify-center">
              {['all', 'javascript', 'typescript', 'python', 'figma', 'react', 'webdev'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all shadow-lg ${
                    selectedCategory === cat 
                      ? 'bg-primary text-white shadow-primary/20' 
                      : 'glass text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-8 py-3 glass border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center space-x-3 disabled:opacity-50 shadow-xl shadow-black/5"
            >
              <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-bold uppercase tracking-widest text-xs">{loading ? t('loading') : t('news_refresh')}</span>
            </button>
          </div>

          {error && (
            <div className="mb-12 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 rounded-2xl text-center font-bold">
              {error}
            </div>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((article) => (
              <motion.div
                key={article.uniqueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="neumorph-card overflow-hidden group flex flex-col h-full hover:border-primary/20 transition-colors bg-gray-50 dark:bg-[#1a1a1a]"
              >
                {article.cover_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 text-gray-400"
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => handleShare(article.url)}
                        className="w-10 h-10 glass border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-center text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-colors shadow-2xl"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      {new Date(article.published_at).toLocaleDateString(t('locale'))}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-light text-sm leading-relaxed mb-6 line-clamp-3">
                    {article.description.replace(/<[^>]*>?/gm, '')}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {article.tag_list?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 glass text-[8px] font-bold text-gray-500 dark:text-gray-400 rounded-lg border-gray-100 dark:border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-black uppercase tracking-widest text-[10px] hover:translate-x-1 transition-transform inline-flex items-center"
                    >
                      {t('read_more')}
                      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="text-center mt-20">
              <button
                onClick={() => {
                  setPage(prev => prev + 1);
                  fetchNews(page + 1);
                }}
                className="inline-block px-12 py-5 glass border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 hover:border-primary/20 transition-all shadow-xl shadow-black/5"
              >
                {t('load_more') || 'Charger plus'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;