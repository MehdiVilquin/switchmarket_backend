const { isRelevantArticle } = require('./filtering');

const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = process.env.NEWSAPI_KEY;
const MAX_PAGE_SIZE = 50; // Nombre maximum d'articles à récupérer de NewsAPI

const normalizeNewsApiItem = (item) => ({
  title: item.title || '',
  url: item.url || '',
  image: item.urlToImage || null,
  description: item.description || '',
  source: item.source?.name || 'NewsAPI',
  publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
  feedType: 'newsapi'
});

/**
 * Récupère les articles via NewsAPI de manière optimisée
 * @param {Object} options - Options de récupération
 * @param {number} options.targetCount - Nombre cible d'articles à récupérer
 * @returns {Promise<Array>} - Articles normalisés et filtrés
 */
exports.fetchNewsApiArticles = async (options = {}) => {
  // Vérifier si l'API key est configurée
  if (!API_KEY) {
    console.log('[NewsAPI] Aucune API key configurée, impossible de récupérer les articles');
    return [];
  }

  // Toujours utiliser le nombre maximum d'articles pour NewsAPI
  // car le taux de pertinence est faible (~4%)
  const pageSize = MAX_PAGE_SIZE;
  
  const url = new URL(NEWS_API_URL);
  url.searchParams.set('q', '(cosmetic OR skincare OR clean beauty OR ethical)');
  url.searchParams.set('from', new Date(Date.now() - 30 * 864e5).toISOString().split('T')[0]);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('apiKey', API_KEY);

  try {
    const startTime = Date.now();
    console.log(`[NewsAPI] Requête: ${url.href.replace(API_KEY, 'API_KEY_HIDDEN')} (pageSize=${pageSize})`);
    
    const response = await fetch(url.href);
    const data = await response.json();

    if (!response.ok) {
      console.error(`[NewsAPI] Erreur: ${data.message || 'Erreur inconnue'}`);
      throw new Error(data.message || 'NewsAPI error');
    }

    console.log(`[NewsAPI] ${data.articles?.length || 0} articles trouvés`);
    
    const normalized = data.articles
      .map(normalizeNewsApiItem)
      .filter(isRelevantArticle);
    
    const fetchTime = Date.now() - startTime;
    console.log(`[NewsAPI] ${normalized.length} articles après filtrage (${fetchTime}ms)`);
    
    return normalized;
  } catch (err) {
    console.error(`[NewsAPI] Exception: ${err.message}`);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};
