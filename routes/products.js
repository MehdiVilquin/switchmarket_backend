const express = require("express")
const router = express.Router()

const productController = require("../controllers/productController")

// Route : GET /products - search by filters via query params
router.get("/", productController.searchProducts)

// Route : GET /products/random/:count? - specific route for random products
router.get("/random/:count?", productController.getRandomProducts)


// Route : GET /products/:id - route for getting a product by ID (must be last)
router.get("/:id", productController.getProductById)



module.exports = router
