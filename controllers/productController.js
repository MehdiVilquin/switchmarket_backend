const Product = require('../models/products');
const Additive = require('../models/additives');

exports.searchProducts = (req, res) => {
  const { all, brand, label, ingredient, additive } = req.query;

  const filters = [];

  if (all) {
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

  if (brand) {
    filters.push({ brands: new RegExp(brand, 'i') });
  }

  if (label) {
    filters.push({ labeltags: label });
  }

  if (ingredient) {
    filters.push({
      ingredients: {
        $elemMatch: { text: new RegExp(ingredient, 'i') } // Utilisation de $elemMatch pour filtrer les éléments dans un tableau
      }
    });
  }

  if (additive) {
    filters.push({ 'additives.tag': additive });
  }

  const query = filters.length > 0 ? { $and: filters } : {};

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
