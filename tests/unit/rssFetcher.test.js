const { fetchRssArticles } = require('../../lib/rssFetcher');
const fs = require('fs');
const path = require('path');
const nock = require('nock');

// Mock du module fs pour éviter de lire/écrire des fichiers réels
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true)
}));

// Mock de la fonction isRelevantArticle
jest.mock('../../lib/filtering', () => ({
  isRelevantArticle: jest.fn(article => {
    // Accepter tous les articles pour simplifier les tests
    return true;
  })
}));

describe('RSS Fetcher', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    nock.cleanAll();
    
    // Mock du fichier de configuration
    fs.readFileSync.mockReturnValue(JSON.stringify({
      sources: [
        {
          name: 'Test Source',
          url: 'https://test-source.com/feed',
          tier: 1,
          category: 'test-category',
          enabled: true
        }
      ]
    }));
  });
  
  afterAll(() => {
    nock.restore();
  });

  test('devrait charger les sources depuis le fichier de configuration', async () => {
    // Mock de la réponse RSS
    nock('https://test-source.com')
      .get('/feed')
      .reply(200, `
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <item>
              <title>test article 1</title>
              <link>https://test-source.com/article1</link>
              <pubDate>Mon, 21 Apr 2025 10:00:00 GMT</pubDate>
              <description>This is a test article</description>
            </item>
            <item>
              <title>non-test article</title>
              <link>https://test-source.com/article2</link>
              <pubDate>Mon, 21 Apr 2025 09:00:00 GMT</pubDate>
              <description>This article should be filtered out</description>
            </item>
          </channel>
        </rss>
      `);
    
    const articles = await fetchRssArticles();
    
    // Vérifier que fs.readFileSync a été appelé avec le bon chemin
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.readFileSync.mock.calls[0][0]).toContain('rss-sources.json');
    
    // Vérifier que les articles ont été correctement récupérés
    // Comme notre mock de isRelevantArticle accepte tous les articles, on s'attend à 2 articles
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe('test article 1');
    expect(articles[0].feedType).toBe('rss');
  });

  test('devrait gérer les erreurs de flux RSS', async () => {
    // Mock d'une erreur de flux RSS
    nock('https://test-source.com')
      .get('/feed')
      .replyWithError('Connection error');
    
    const articles = await fetchRssArticles();
    
    // Vérifier que le résultat est un tableau vide (pas d'erreur levée)
    expect(articles).toEqual([]);
    
    // Vérifier que writeFileSync a été appelé pour mettre à jour le statut d'erreur
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('devrait s\'arrêter après avoir atteint suffisamment d\'articles', async () => {
    // Modifier le mock de configuration pour avoir plusieurs sources
    fs.readFileSync.mockReturnValue(JSON.stringify({
      sources: [
        {
          name: 'Source 1',
          url: 'https://source1.com/feed',
          tier: 1,
          enabled: true
        },
        {
          name: 'Source 2',
          url: 'https://source2.com/feed',
          tier: 2,
          enabled: true
        }
      ]
    }));
    
    // Mock des réponses RSS
    nock('https://source1.com')
      .get('/feed')
      .reply(200, `
        <rss version="2.0">
          <channel>
            <title>Source 1</title>
            <item>
              <title>test article 1</title>
              <link>https://source1.com/article1</link>
              <pubDate>Mon, 21 Apr 2025 10:00:00 GMT</pubDate>
            </item>
            <item>
              <title>test article 2</title>
              <link>https://source1.com/article2</link>
              <pubDate>Mon, 21 Apr 2025 09:00:00 GMT</pubDate>
            </item>
            <item>
              <title>test article 3</title>
              <link>https://source1.com/article3</link>
              <pubDate>Mon, 21 Apr 2025 08:00:00 GMT</pubDate>
            </item>
          </channel>
        </rss>
      `);
    
    // Cette source ne devrait pas être appelée si targetCount est 1
    const source2Mock = nock('https://source2.com')
      .get('/feed')
      .reply(200, `<rss version="2.0"><channel><title>Source 2</title></channel></rss>`);
    
    // Appeler avec un targetCount de 1
    await fetchRssArticles({ targetCount: 1 });
    
    // Vérifier que la deuxième source n'a pas été appelée
    expect(source2Mock.isDone()).toBe(false);
  });
});
