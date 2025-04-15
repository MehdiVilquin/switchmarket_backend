const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// Route : GET /products/random/:count? - doit être en premier pour éviter de passer par /:id
router.get("/random/:count?", productController.getRandomProducts);

// Route : GET /products/:id - route dynamique pour récupérer un produit par son ID
router.get("/:id", productController.getProductById);

// Route : GET /products - recherche par filtres via query params
router.get("/", productController.searchProducts);

module.exports = router;
