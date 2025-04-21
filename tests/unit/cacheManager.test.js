const cache = require('../../lib/cacheManager');

describe('Cache Manager', () => {
  beforeEach(() => {
    // Réinitialiser le cache avant chaque test
    cache.clear();
  });

  test('devrait stocker et récupérer des données', () => {
    const testData = { test: 'data' };
    cache.set('test-key', testData);
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  test('devrait retourner null pour une clé inexistante', () => {
    const retrieved = cache.get('nonexistent-key');
    expect(retrieved).toBeNull();
  });

  test('devrait expirer les entrées après le délai spécifié', () => {
    jest.useFakeTimers();
    
    const testData = { test: 'data' };
    cache.set('test-key', testData);
    
    // Avancer le temps de 31 minutes (au-delà du TTL par défaut de 30 minutes)
    jest.advanceTimersByTime(31 * 60 * 1000);
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toBeNull();
    
    jest.useRealTimers();
  });

  test('devrait supprimer une entrée spécifique', () => {
    const testData = { test: 'data' };
    cache.set('test-key', testData);
    cache.delete('test-key');
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toBeNull();
  });

  test('devrait fournir des statistiques sur le cache', () => {
    const testData1 = { test: 'data1' };
    const testData2 = { test: 'data2' };
    
    cache.set('key1', testData1);
    cache.set('key2', testData2);
    
    const stats = cache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.keys).toContain('key1');
    expect(stats.keys).toContain('key2');
  });
});
