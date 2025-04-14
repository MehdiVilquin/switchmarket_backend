var express = require('express');
var router = express.Router();

require('../models/connection');
const Product = require('../models/product');

// GET /products : recherche avec filtres simples
router.get('/', (req, res) => {
  const { all, brand, label, ingredient, additive } = req.query;

  // Tableau vide
  const filters = [];

  // Recherche globale (all)
  if (all) {
    const regex = new RegExp(all, 'i'); // insensitive à la casse
    filters.push({
      $or: [ //  Specifier qu'au moins un des champs doit correspondre pour selectionner un produit
        { product_name: regex },
        { brands: regex },
        { labeltags: regex },
        { 'ingredients.text': regex },
        { 'additives.tag': regex }
      ]
    });
  }

  // Filtre spécifique par marque
  if (brand) {
    filters.push({ brands: new RegExp(brand, 'i') });
  }

  // Filtre par label
  if (label) {
    filters.push({ labeltags: label });
  }

  // Filtre par ingrédient
  if (ingredient) {
    filters.push({
      ingredients: {
 //  vérifier si au - un élément du tableau ingredients contient le champ text qui correspond à la regex précisée
        $elemMatch: { 
          text: new RegExp(ingredient, 'i')
        }
      }
    });
  }

  // Filtre par additif
  if (additive) {
    filters.push({ 'additives.tag': additive });
  }

  const query = filters.length > 0 ? { $and: filters } : {};

  Product.find(query)
  // Remplace l'ID de l'additif par le document complet
    .populate('additives.additiveRef')  
    .then(data => {
      res.json({ result: true, products: data });
    })
    .catch(error => {
      console.error(error);
      res.json({ result: false, error: 'Erreur lors de la recherche des produits' });
    });
});

module.exports = router;
