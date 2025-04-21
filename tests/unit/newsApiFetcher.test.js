const { fetchNewsApiArticles } = require('../../lib/newsApiFetcher');
const nock = require('nock');

// Mock de la fonction isRelevantArticle
jest.mock('../../lib/filtering', () => ({
  isRelevantArticle: jest.fn(article => {
    // Accepter tous les articles pour simplifier les tests
    return true;
  })
}));

// Mock de process.env
process.env.NEWSAPI_KEY = 'test-api-key';

describe('NewsAPI Fetcher', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    nock.cleanAll();
  });
  
  afterAll(() => {
    nock.restore();
  });

  test('devrait récupérer et filtrer les articles de NewsAPI', async () => {
    // Mock de la réponse NewsAPI
    nock('https://newsapi.org')
      .get(/\/v2\/everything/)
      .query(true) // Accepter n'importe quels paramètres de requête
      .reply(200, {
        status: 'ok',
        totalResults: 2,
        articles: [
          {
            title: 'test article from NewsAPI',
            url: 'https://example.com/article1',
            urlToImage: 'https://example.com/image1.jpg',
            description: 'This is a test article',
            source: { name: 'Test Source' },
            publishedAt: '2025-04-21T10:00:00Z'
          },
          {
            title: 'non-test article',
            url: 'https://example.com/article2',
            description: 'This article should be filtered out',
            source: { name: 'Another Source' },
            publishedAt: '2025-04-21T09:00:00Z'
          }
        ]
      });
    
    const articles = await fetchNewsApiArticles();
    
    // Vérifier que les articles ont été correctement récupérés
    // Comme notre mock de isRelevantArticle accepte tous les articles, on s'attend à 2 articles
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe('test article from NewsAPI');
    expect(articles[0].feedType).toBe('newsapi');
  });

  test('devrait gérer les erreurs de l\'API', async () => {
    // Mock d'une erreur de l'API
    nock('https://newsapi.org')
      .get(/\/v2\/everything/)
      .query(true)
      .reply(401, {
        status: 'error',
        code: 'apiKeyInvalid',
        message: 'Your API key is invalid'
      });
    
    // La fonction devrait capturer l'erreur et retourner un tableau vide
    const articles = await fetchNewsApiArticles();
    expect(articles).toEqual([]);
  });

  test('devrait utiliser le nombre maximum d\'articles configuré', async () => {
    // Mock de la réponse NewsAPI
    const scope = nock('https://newsapi.org')
      .get(/\/v2\/everything/)
      .query(query => {
        // Vérifier que pageSize est bien défini à 50
        return query.pageSize === '50';
      })
      .reply(200, {
        status: 'ok',
        totalResults: 0,
        articles: []
      });
    
    await fetchNewsApiArticles();
    
    // Vérifier que la requête a été faite avec les bons paramètres
    expect(scope.isDone()).toBe(true);
  });
});
