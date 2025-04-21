const request = require('supertest');
const app = require('../../app');
const cache = require('../../lib/cacheManager');

// Mock des modules de récupération d'articles
jest.mock('../../lib/rssFetcher', () => ({
  fetchRssArticles: jest.fn()
}));

jest.mock('../../lib/newsApiFetcher', () => ({
  fetchNewsApiArticles: jest.fn()
}));

const { fetchRssArticles } = require('../../lib/rssFetcher');
const { fetchNewsApiArticles } = require('../../lib/newsApiFetcher');

describe('News Controller (Integration)', () => {
  beforeEach(() => {
    // Réinitialiser les mocks et le cache avant chaque test
    jest.clearAllMocks();
    cache.clear();
    
    // Mock des données de test
    const rssArticles = [
      {
        title: 'RSS Article 1',
        url: 'https://example.com/rss1',
        description: 'Test RSS article',
        source: 'Test RSS Source',
        publishedAt: new Date('2025-04-21T10:00:00Z'),
        feedType: 'rss'
      },
      {
        title: 'RSS Article 2',
        url: 'https://example.com/rss2',
        description: 'Another test RSS article',
        source: 'Test RSS Source',
        publishedAt: new Date('2025-04-20T10:00:00Z'),
        feedType: 'rss'
      }
    ];
    
    const newsApiArticles = [
      {
        title: 'NewsAPI Article',
        url: 'https://example.com/newsapi',
        description: 'Test NewsAPI article',
        source: 'Test NewsAPI Source',
        publishedAt: new Date('2025-04-21T11:00:00Z'),
        feedType: 'newsapi'
      }
    ];
    
    // Configurer les mocks pour retourner les données de test
    fetchRssArticles.mockResolvedValue(rssArticles);
    fetchNewsApiArticles.mockResolvedValue(newsApiArticles);
  });

  test('GET /news devrait retourner les articles combinés', async () => {
    const response = await request(app).get('/news');
    
    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBe(3);
    expect(response.body.articles[0].title).toBe('NewsAPI Article'); // Trié par date (le plus récent en premier)
    expect(response.body.stats).toBeDefined();
    expect(response.body.stats.bySource.rss).toBe(2);
    expect(response.body.stats.bySource.newsapi).toBe(1);
    
    // Vérifier que les fonctions de récupération ont été appelées
    expect(fetchRssArticles).toHaveBeenCalled();
    expect(fetchNewsApiArticles).toHaveBeenCalled();
  });

  test('GET /news avec limit devrait limiter le nombre d\'articles', async () => {
    const response = await request(app).get('/news?limit=1');
    
    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBe(1);
    expect(response.body.stats.requestParams.limit).toBe(1);
  });

  test('GET /news avec feedType=rss devrait filtrer par type de flux', async () => {
    const response = await request(app).get('/news?feedType=rss');
    
    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBe(2);
    expect(response.body.articles[0].feedType).toBe('rss');
    expect(response.body.stats.requestParams.feedType).toBe('rss');
    
    // Vérifier que seule la fonction de récupération RSS a été appelée
    expect(fetchRssArticles).toHaveBeenCalled();
    expect(fetchNewsApiArticles).not.toHaveBeenCalled();
  });

  test('devrait utiliser le cache pour les requêtes répétées', async () => {
    // Première requête
    await request(app).get('/news');
    
    // Réinitialiser les mocks
    fetchRssArticles.mockClear();
    fetchNewsApiArticles.mockClear();
    
    // Deuxième requête (devrait utiliser le cache)
    const response = await request(app).get('/news');
    
    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBe(3);
    expect(response.body.stats.cache.hit).toBe(true);
    
    // Vérifier que les fonctions de récupération n'ont pas été appelées à nouveau
    expect(fetchRssArticles).not.toHaveBeenCalled();
    expect(fetchNewsApiArticles).not.toHaveBeenCalled();
  });

  test('devrait ignorer le cache avec refresh=true', async () => {
    // Première requête pour remplir le cache
    await request(app).get('/news');
    
    // Réinitialiser les mocks
    fetchRssArticles.mockClear();
    fetchNewsApiArticles.mockClear();
    
    // Requête avec refresh=true
    const response = await request(app).get('/news?refresh=true');
    
    expect(response.status).toBe(200);
    expect(response.body.stats.requestParams.refresh).toBe(true);
    
    // Vérifier que les fonctions de récupération ont été appelées à nouveau
    expect(fetchRssArticles).toHaveBeenCalled();
    expect(fetchNewsApiArticles).toHaveBeenCalled();
  });

  test('devrait gérer les erreurs de récupération', async () => {
    // Simuler une erreur dans les fonctions de récupération
    fetchRssArticles.mockRejectedValue(new Error('Test RSS error'));
    fetchNewsApiArticles.mockRejectedValue(new Error('Test NewsAPI error'));
    
    const response = await request(app).get('/news');
    
    // Devrait toujours retourner un statut 500 en cas d'erreur
    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});
