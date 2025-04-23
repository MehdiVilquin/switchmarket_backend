const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const isAdmin = require("../middlewares/isAdmin")

const productController = require("../controllers/productController")

// Route : GET /products - search by filters via query params
router.get("/", productController.searchProducts)

// Route : GET /products/random/:count? - specific route for random products
router.get("/random/:count?", productController.getRandomProducts)


// Route : GET /products/:id - route for getting a product by ID (must be last)
router.get("/:id", productController.getProductById)


// Route pour créer un nouveau produit (POST /products)
router.post("/", auth, isAdmin, productController.createProduct)

// Route pour mettre à jour un produit (PUT /products/:id)
router.put("/:id", auth, isAdmin, productController.updateProduct)

// Route pour supprimer un produit (DELETE /products/:id)
router.delete("/:id", auth, isAdmin, productController.deleteProduct)


module.exports = router
