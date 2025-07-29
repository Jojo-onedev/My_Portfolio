import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RefreshIcon } from '@heroicons/react/outline';
import { ShareIcon } from '@heroicons/react/outline';

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (newPage = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const tags = ['javascript', 'typescript', 'python', 'java', 'figma', 'HTML', 'CSS', 'react', 'nodejs', 'webdev'];
      
      // Filtrer les tags selon la catégorie sélectionnée
      const filteredTags = selectedCategory === 'all' 
        ? tags 
        : [selectedCategory];
      
      const promises = filteredTags.map(tag => 
        fetch(`https://dev.to/api/articles?tag=${tag}&per_page=3&page=${newPage}`)
      );
      
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(res => res.json()));
      
      const newArticles = data.flat().map((article, index) => ({
        ...article,
        uniqueId: `${article.id}_${index}_${page}`
      }));
      
      if (newPage === 1) {
        setNews(newArticles);
      } else {
        setNews(prev => [...prev, ...newArticles]);
      }
      
      if (newArticles.length < 15) {
        setHasMore(false);
      }
    } catch (err) {
      setError(t('news_error_loading'));
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, t]);

  const shareOnFacebook = useCallback((article) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`;
    window.open(url, '_blank');
  }, []);

  const shareOnWhatsApp = useCallback((article) => {
    const url = `https://wa.me/?text=${encodeURIComponent(article.title)}%20${encodeURIComponent(article.url)}`;
    window.open(url, '_blank');
  }, []);

  const handleRefresh = useCallback(() => {
    setPage(1);
    fetchNews(1);
  }, [fetchNews]);

  const handleShare = useCallback((url) => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url
      }).catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert(t('link_copied'));
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
      document.body.removeChild(textArea);
    }
  }, [t]);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, fetchNews]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('news_title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('news_subtitle')}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-6"
            >
              <RefreshIcon className="h-5 w-5 mr-2" />
              {loading ? t('loading') : t('news_refresh')}
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                All
              </button>
              {['javascript', 'typescript', 'python', 'java', 'figma', 'HTML', 'CSS', 'react', 'nodejs', 'webdev'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <motion.div
                key={article.uniqueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.cover_image && (
                  <img 
                    src={article.cover_image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.published_at).toLocaleDateString(t('locale'))}
                    </span>
                    <button 
                      onClick={() => handleShare(article.url)}
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label={t('share_article')}
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tag_list.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center"
                  >
                    {t('read_more')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setPage(prev => prev + 1);
                  fetchNews(page + 1);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Charger plus
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default News;