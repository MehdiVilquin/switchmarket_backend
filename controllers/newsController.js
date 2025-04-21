const { fetchRssArticles } = require('../lib/rssFetcher');
const { fetchNewsApiArticles } = require('../lib/newsApiFetcher');
const cache = require('../lib/cacheManager');

// Durée de validité du cache (15 minutes)
const CACHE_TTL = 15 * 60 * 1000;

exports.fetchNews = async (req, res) => {
  try {
    // Récupération des paramètres de requête
    const { limit = 20, feedType, refresh = false } = req.query;
    const maxResults = parseInt(limit, 10) || 20;
    const forceRefresh = refresh === 'true' || refresh === '1';
    
    console.log(`[API /news] Début de la requête (limit=${maxResults}, feedType=${feedType || 'all'}, refresh=${forceRefresh})`);
    
    // Clé de cache unique basée sur les paramètres
    const cacheKey = `news_${feedType || 'all'}`;
    
    // Vérifier si les données sont en cache et non expirées
    let allArticles = null;
    if (!forceRefresh) {
      allArticles = cache.get(cacheKey, CACHE_TTL);
    }
    
    // Si pas en cache ou forceRefresh, récupérer les données
    if (!allArticles) {
      console.log(`[API /news] Cache miss ou refresh forcé, récupération des données fraîches`);
      
      // Options pour les récupérateurs de flux
      const fetchOptions = {
        targetCount: maxResults
      };
      
      // Récupération conditionnelle des articles selon le type de flux demandé
      let rssArticles = [];
      let newsApiArticles = [];
      
      if (!feedType || feedType === 'all' || feedType === 'rss') {
        rssArticles = await fetchRssArticles(fetchOptions);
      }
      
      if (!feedType || feedType === 'all' || feedType === 'newsapi') {
        newsApiArticles = await fetchNewsApiArticles(fetchOptions).catch(err => {
          console.error('[API /news] Erreur NewsAPI:', err.message);
          return []; // non bloquant si désactivé
        });
      }

      console.log(`[API /news] Articles récupérés: ${rssArticles.length} RSS, ${newsApiArticles.length} NewsAPI`);
      
      // Combiner et stocker en cache
      allArticles = [...rssArticles, ...newsApiArticles];
      cache.set(cacheKey, allArticles);
      
      console.log(`[API /news] Données mises en cache avec la clé "${cacheKey}"`);
    } else {
      console.log(`[API /news] Utilisation du cache pour la clé "${cacheKey}" (${allArticles.length} articles)`);
    }

    // Tri et réduction
    const top = allArticles
      .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
      .slice(0, maxResults);

    // Statistiques pour le débogage
    const stats = {
      total: allArticles.length,
      displayed: top.length,
      bySource: {
        rss: allArticles.filter(a => a.feedType === 'rss').length,
        newsapi: allArticles.filter(a => a.feedType === 'newsapi').length
      },
      requestParams: {
        limit: maxResults,
        feedType: feedType || 'all',
        refresh: forceRefresh
      },
      cache: {
        hit: allArticles !== null && !forceRefresh,
        keys: Object.keys(cache.getStats().keys),
        ttl: CACHE_TTL / 60000 + ' minutes'
      },
      performance: {
        articleRatio: allArticles.length > 0 ? (top.length / allArticles.length * 100).toFixed(1) + '%' : '0%'
      }
    };

    console.log(`[API /news] Réponse: ${top.length} articles (${stats.bySource.rss} RSS, ${stats.bySource.newsapi} NewsAPI)`);
    
    res.status(200).json({ 
      articles: top,
      stats: stats
    });

  } catch (err) {
    console.error('[API /news] Erreur globale:', err.message);
    res.status(500).json({ error: err.message });
  }
};
