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
  const [initialLoad, setInitialLoad] = useState(true);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchNews = useCallback(async (newPage = 1, isRetry = false) => {
    if (loading && newPage === 1 && !isRetry) return;
    setLoading(true);
    if (isRetry || newPage === 1) setError(null);
    try {
      const tags = ['javascript', 'react', 'webdev'];
      const filteredTags = selectedCategory === 'all' ? tags : [selectedCategory];
      const results = [];
      let anySuccess = false;
      
      for (const tag of filteredTags) {
        try {
          const response = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=3&page=${newPage}`);
          if (!response.ok) {
            if (response.status === 429) { await delay(1000); continue; }
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          const data = await response.json();
          if (data.length > 0) anySuccess = true;
          results.push(...data);
          await delay(300);
        } catch {
          continue;
        }
      }
      
      if (!anySuccess && results.length === 0) {
        throw new Error('Aucun article récupéré');
      }
      
      const newArticles = results.map((article, index) => ({
        ...article,
        uniqueId: `${article.id}_${index}_${newPage}`
      }));
      
      if (newPage === 1) setNews(newArticles);
      else setNews(prev => [...prev, ...newArticles]);
      setHasMore(newArticles.length > 0);
    } catch {
      setError(t('news_error_loading') || 'Erreur lors du chargement des actualités');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [selectedCategory, loading, t]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    fetchNews(1, true);
  }, [fetchNews]);

  const handleRetry = useCallback(() => {
    fetchNews(page, true);
  }, [fetchNews, page]);

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

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNews(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNews(1);
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = !loading && !error && news.length === 0;

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
                  onClick={() => handleCategoryChange(cat)}
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

          {/* Error State with Retry */}
          {error && (
            <div className="mb-12 p-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-bold">{error}</span>
                </div>
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500/20 text-red-500 dark:text-red-400 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-500/30 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshIcon className="h-4 w-4" />
                  <span>{t('retry') || 'Réessayer'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {isEmpty && !initialLoad && (
            <div className="mb-12 p-12 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2zM9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 font-light mb-4">
                {selectedCategory === 'all' 
                  ? t('news_empty_all') || 'Aucun article trouvé pour le moment.'
                  : t('news_empty_category') || `Aucun article pour la catégorie "${selectedCategory}".`}
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                {t('refresh') || 'Actualiser'}
              </button>
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
                      width="400"
                      height="192"
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 text-gray-400"
                    />
                    <div className="absolute top-4 right-4">
                       <button 
                         aria-label="Partager l'article"
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

          {/* Loading More */}
          {hasMore && !loading && !error && news.length > 0 && (
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

          {/* Loading indicator for load more */}
          {hasMore && loading && news.length > 0 && (
            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-bold uppercase tracking-widest text-xs">{t('loading_more') || 'Chargement...'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;