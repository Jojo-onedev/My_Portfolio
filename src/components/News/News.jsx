import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshIcon } from '@heroicons/react/outline';
import { ShareIcon } from '@heroicons/react/outline';


const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async (newPage = 1) => {
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
      setError('Erreur lors du chargement des actualités');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const shareOnFacebook = (article) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`;
    window.open(url, '_blank');
  };

  const shareOnWhatsApp = (article) => {
    const url = `https://wa.me/?text=${encodeURIComponent(article.title)}%20${encodeURIComponent(article.url)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

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
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Actualités
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Dernières actualités du développement web
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <button
              onClick={fetchNews}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <RefreshIcon className="h-5 w-5 mr-2" />
              )}
              Rafraîchir
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                Tous
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
            {news.map((article, index) => (
              <motion.div
                key={article.uniqueId || `article-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4">

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/90 transition-colors"
                      >
                        Lire plus →
                      </a>
                    </div>
                  </div>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => shareOnFacebook(article)}
                        className="text-primary hover:text-primary/90 transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                        Facebook
                      </button>
                      <button
                        onClick={() => shareOnWhatsApp(article)}
                        className="text-primary hover:text-primary/90 transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                        WhatsApp
                      </button>
                    </div>
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