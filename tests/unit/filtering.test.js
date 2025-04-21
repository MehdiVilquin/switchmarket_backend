const { isRelevantArticle } = require('../../lib/filtering');

describe('Filtering Module', () => {
  test('devrait identifier les articles pertinents', () => {
    // Articles qui devraient être acceptés
    const relevantArticles = [
      {
        title: 'Guide to skincare routines',
        description: 'Learn about the best skincare practices'
      },
      {
        title: 'Ethical cosmetics brands',
        description: 'Top sustainable beauty products'
      },
      {
        title: 'Natural ingredients in moisturizer',
        description: 'Benefits of plant-based skincare'
      }
    ];
    
    relevantArticles.forEach(article => {
      expect(isRelevantArticle(article)).toBe(true);
    });
  });
  
  test('devrait rejeter les articles non pertinents', () => {
    // Articles qui devraient être rejetés
    const irrelevantArticles = [
      {
        title: 'Stock market news',
        description: 'Financial updates for investors'
      },
      {
        title: 'Gaming console review',
        description: 'Latest video game releases'
      },
      {
        title: 'Political debate coverage',
        description: 'Election news and updates'
      }
    ];
    
    irrelevantArticles.forEach(article => {
      expect(isRelevantArticle(article)).toBe(false);
    });
  });
  
  test('devrait rejeter les articles contenant des mots-clés négatifs', () => {
    // Articles avec des mots-clés positifs mais aussi négatifs
    const mixedArticles = [
      {
        title: 'Skincare routine for gamers',
        description: 'How to take care of your skin while gaming'
      },
      {
        title: 'Beauty supplements and vitamins',
        description: 'The best supplements for skin health'
      }
    ];
    
    mixedArticles.forEach(article => {
      expect(isRelevantArticle(article)).toBe(false);
    });
  });
});
