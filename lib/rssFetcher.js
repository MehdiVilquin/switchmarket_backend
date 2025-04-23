const Parser = require('rss-parser');
const { isRelevantArticle } = require('./filtering');
const fs = require('fs');
const path = require('path');

// Configuration du parser RSS
const parser = new Parser({
  timeout: 5000, // Timeout de 5 secondes pour éviter les longs délais
  maxRedirects: 3, // Limite le nombre de redirections
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail']
    ]
  }
});

/**
 * Charge les sources RSS depuis le fichier de configuration
 * @returns {Array} Liste des sources RSS
 */
function loadRssSources() {
  try {
    const configPath = path.join(__dirname, '../config/rss-sources.json');
    const rawData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(rawData);
    
    // Filtrer les sources activées
    return config.sources.filter(source => source.enabled);
  } catch (err) {
    console.error(`[RSS] Erreur lors du chargement des sources: ${err.message}`);
    // Sources par défaut en cas d'erreur
    return [
      { name: 'Sustainable Jungle', url: 'https://www.sustainablejungle.com/feed/', tier: 1 },
      { name: 'EcoCult', url: 'https://ecocult.com/feed/', tier: 1 }
    ];
  }
}

/**
 * Extrait l'URL de l'image d'un article RSS à partir de différentes sources possibles
 * @param {Object} item - Item RSS
 * @returns {string|null} - URL de l'image ou null si aucune image trouvée
 */
const extractImageFromRssItem = (item) => {
  // 1. Vérifier l'enclosure (méthode standard)
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  
  // 2. Vérifier les médias (format courant)
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  
  // 3. Vérifier les médias dans un format alternatif
  if (item['media:content'] && Array.isArray(item['media:content'])) {
    const mediaContent = item['media:content'].find(media => media.$ && media.$.url);
    if (mediaContent) {
      return mediaContent.$.url;
    }
  }
  
  // 4. Vérifier les thumbnails
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  
  // 5. Chercher dans le contenu HTML
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  // 6. Chercher dans la description (certains flux mettent les images ici)
  if (item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  // 7. Vérifier si l'item a une propriété image directe
  if (item.image && item.image.url) {
    return item.image.url;
  }
  
  // Aucune image trouvée
  return null;
};

const normalizeRssItem = (item, sourceName) => ({
  title: item.title || '',
  url: item.link || '',
  image: extractImageFromRssItem(item),
  description: item.contentSnippet || item.content || '',
  source: sourceName,
  publishedAt: item.pubDate ? new Date(item.pubDate) : null,
  feedType: 'rss'
});

/**
 * Récupère les articles RSS de manière optimisée
 * @param {Object} options - Options de récupération
 * @param {number} options.targetCount - Nombre cible d'articles à récupérer (pour optimisation)
 * @returns {Promise<Array>} - Articles normalisés et filtrés
 */
exports.fetchRssArticles = async (options = {}) => {
  const { targetCount = 20 } = options;
  const results = [];
  const startTime = Date.now();
  
  // Charger les sources depuis le fichier de configuration
  const sources = loadRssSources();
  console.log(`[RSS] ${sources.length} sources actives chargées depuis la configuration`);
  
  // Stratégie: récupérer d'abord les sources les plus efficaces
  // et s'arrêter une fois qu'on a suffisamment d'articles
  
  // Trier les sources par tier (efficacité)
  const sortedSources = [...sources].sort((a, b) => a.tier - b.tier);
  
  for (const source of sortedSources) {
    // Si on a déjà suffisamment d'articles pertinents, on peut s'arrêter
    // avec une marge de sécurité (1.5x) pour assurer la diversité après tri par date
    if (results.length > targetCount * 1.5) {
      console.log(`[RSS] Arrêt anticipé: ${results.length} articles déjà collectés (objectif: ${targetCount})`);
      break;
    }
    
    try {
      const sourceStartTime = Date.now();
      const feed = await parser.parseURL(source.url);
      const fetchTime = Date.now() - sourceStartTime;
      
      console.log(`[RSS] ${source.name}: ${feed.items.length} articles trouvés (${fetchTime}ms)`);
      
      const filtered = feed.items
        .map((item) => normalizeRssItem(item, source.name))
        .filter(isRelevantArticle);
      
      console.log(`[RSS] ${source.name}: ${filtered.length} articles après filtrage`);
      results.push(...filtered);
    } catch (err) {
      console.warn(`[RSS] Erreur flux ${source.name}: ${err.message}`);
      
      // Mettre à jour le statut d'erreur dans le fichier de configuration
      try {
        const configPath = path.join(__dirname, '../config/rss-sources.json');
        const rawData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(rawData);
        
        const sourceIndex = config.sources.findIndex(s => s.name === source.name);
        if (sourceIndex !== -1) {
          config.sources[sourceIndex].lastError = err.message;
          config.sources[sourceIndex].lastErrorTime = new Date().toISOString();
          
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        }
      } catch (writeErr) {
        console.error(`[RSS] Impossible de mettre à jour le statut d'erreur: ${writeErr.message}`);
      }
    }
  }

  const totalTime = Date.now() - startTime;
  console.log(`[RSS] Total: ${results.length} articles RSS (récupérés en ${totalTime}ms)`);
  return results;
};
