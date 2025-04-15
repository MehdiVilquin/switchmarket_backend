const Product = require('../models/products');
const Additive = require('../models/additives');
const mongoose = require('mongoose');


exports.searchProducts = (req, res) => {
  // Récupération des paramètres de recherche depuis la requête
  const { all, brand, label, ingredient, additive } = req.query;

  // On initialise un tableau pour stocker les filtres
  const filters = [];

  if (all) { // si le paramètre "all" est utilisé, elle est appliquée à tous les champs
    const regex = new RegExp(all, 'i');
    filters.push({
      $or: [ // Utilisation de $or pour combiner plusieurs conditions
        { product_name: regex },
        { brands: regex },
        { labeltags: regex },
        { 'ingredients.text': regex },
        { 'additives.tag': regex }
      ]
    });
  }
  // Si le paramètre "all" n'est pas utilisé, on applique les autres filtres individuellement
  if (brand) {
    filters.push({ brands: new RegExp(brand, 'i') });
  }

  // Si le paramètre "label" est utilisé, on applique le filtre sur les labels
  if (label) {
    filters.push({ labeltags: label });
  }
  // Si le paramètre "ingredient" est utilisé, on applique le filtre sur les ingrédients
  if (ingredient) {
    filters.push({
      ingredients: {
        $elemMatch: { text: new RegExp(ingredient, 'i') } // Utilisation de $elemMatch pour filtrer les éléments dans un tableau
      }
    });
  }
  // Si le paramètre "additive" est utilisé, on applique le filtre sur les additifs
  if (additive) {
    filters.push({ 'additives.tag': additive });
  }

  // On vérifie si des filtres ont été ajoutés
  // Si aucun filtre n'est spécifié, on renvoie tous les produits
  // Si des filtres sont spécifiés, on construit la requête
  const query = filters.length > 0 ? { $and: filters } : {};

  // On effectue la recherche dans la base de données
  Product.find(query)
    .populate('additives.additiveRef') // Remplacez par le bon champ de référence si nécessaire
    .then(data => {
      res.json({ result: true, products: data });
    })
    .catch(error => {
      console.error(error);
      res.json({ result: false, error: 'Erreur lors de la recherche des produits' });
    });
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  // Vérifie que l'ID est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    const product = await Product.findById(id).populate('additives.additiveRef');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getRandomProducts = async (req, res) => {
  const count = parseInt(req.query.count) || 6; // nombre de produits à récupérer, par défaut 6

  try {
    const randomProducts = await Product.aggregate([
      { $sample: { size: count } }
    ]);

    res.json({ result: true, products: randomProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Erreur lors de la récupération de produits aléatoires" });
  }
}
