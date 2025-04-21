module.exports = {
  // Indique l'environnement de test (Node.js)
  testEnvironment: 'node',
  
  // Dossiers à ignorer lors des tests
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Fichiers de configuration pour les tests
  setupFilesAfterEnv: ['./tests/setup.js'],
  
  // Couverture de code
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'lib/**/*.js',
    'controllers/**/*.js',
    '!**/node_modules/**'
  ],
  
  // Timeout pour les tests (10 secondes)
  testTimeout: 10000
};
