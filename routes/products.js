const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// Route : GET /products avec filtres via query params
router.get("/", productController.searchProducts);

module.exports = router;
