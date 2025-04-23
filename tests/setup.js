// Configuration globale pour les tests Jest

// Désactiver les logs pendant les tests
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Configurer les variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.NEWSAPI_KEY = 'test-api-key';

// Augmenter le timeout pour les tests qui font des requêtes réseau
jest.setTimeout(10000);
