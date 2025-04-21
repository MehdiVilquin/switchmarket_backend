/**
 * Module de gestion du cache pour les articles d'actualités
 * Permet de stocker les résultats des requêtes pour éviter de les refaire trop souvent
 */

// Cache en mémoire simple
const cache = {
  // Structure: { key: { data, timestamp } }
  store: {},
  
  /**
   * Récupère une entrée du cache si elle existe et n'est pas expirée
   * @param {string} key - Clé de l'entrée
   * @param {number} maxAge - Durée de validité en ms (par défaut 30 minutes)
   * @returns {any|null} - Données ou null si non trouvé/expiré
   */
  get(key, maxAge = 30 * 60 * 1000) {
    const entry = this.store[key];
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > maxAge) {
      // Entrée expirée
      delete this.store[key];
      return null;
    }
    
    return entry.data;
  },
  
  /**
   * Stocke une entrée dans le cache
   * @param {string} key - Clé de l'entrée
   * @param {any} data - Données à stocker
   */
  set(key, data) {
    this.store[key] = {
      data,
      timestamp: Date.now()
    };
  },
  
  /**
   * Supprime une entrée du cache
   * @param {string} key - Clé de l'entrée
   */
  delete(key) {
    delete this.store[key];
  },
  
  /**
   * Vide le cache entièrement
   */
  clear() {
    this.store = {};
  },
  
  /**
   * Retourne des statistiques sur le cache
   * @returns {Object} - Statistiques
   */
  getStats() {
    const now = Date.now();
    const keys = Object.keys(this.store);
    
    return {
      size: keys.length,
      keys: keys,
      oldestEntry: keys.length > 0 ? 
        Math.min(...keys.map(k => now - this.store[k].timestamp)) : null,
      newestEntry: keys.length > 0 ? 
        Math.max(...keys.map(k => now - this.store[k].timestamp)) : null
    };
  }
};

module.exports = cache;
