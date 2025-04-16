const Product = require("../models/products")
const mongoose = require("mongoose")

/**
 * Récupérer un produit par son ID
 */
exports.getProductById = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ result: false, message: "ID invalide" })
  }

  try {
    // Only populate additiveRef, not effects since Effect model doesn't exist
    const product = await Product.findById(id).populate("additives.additiveRef")
    if (!product) {
      return res.status(404).json({ result: false, message: "Produit non trouvé" })
    }
    res.json({ result: true, product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ result: false, error: "Erreur serveur" })
  }
}

/**
 * Rechercher des produits avec plusieurs filtres
 * Paramètres attendus dans req.query : all, brand, label, ingredient, additive
 * Ajout de pagination avec page et limit
 */
exports.searchProducts = async (req, res) => {
  const { all, brand, label, ingredient, additive, page = 1, limit = 10 } = req.query
  const filters = []

  if (all) {
    const regex = new RegExp(all, "i")
    filters.push({
      $or: [
        { product_name: regex },
        { brands: regex },
        { labeltags: regex },
        { "ingredients.text": regex },
        { "additives.tag": regex },
      ],
    })
  }
  if (brand) {
    filters.push({ brands: new RegExp(brand, "i") })
  }
  if (label) {
    filters.push({ labeltags: label })
  }
  if (ingredient) {
    filters.push({
      ingredients: { $elemMatch: { text: new RegExp(ingredient, "i") } },
    })
  }
  if (additive) {
    filters.push({ "additives.tag": additive })
  }

  // Si aucun filtre n'est fourni, on retourne tous les produits
  const query = filters.length > 0 ? { $and: filters } : {}

  try {
    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const limitNum = Number.parseInt(limit)

    // Only populate additiveRef, not effects since Effect model doesn't exist
    const products = await Product.find(query).skip(skip).limit(limitNum).populate("additives.additiveRef")

    // Get total count for pagination info
    const total = await Product.countDocuments(query)

    res.json({
      result: true,
      products,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ result: false, error: "Erreur lors de la recherche des produits" })
  }
}

/**
 * Récupérer un échantillon aléatoire de produits
 * Utilise l'agrégation pour retourner un nombre aléatoire de documents
 */
exports.getRandomProducts = async (req, res) => {
  const count = req.params.count ? Number.parseInt(req.params.count) : 6
  try {
    // Utilisation de $sample pour obtenir un échantillon aléatoire
    let randomProducts = await Product.aggregate([{ $sample: { size: count } }])

    // Puis, on effectue le populate manuellement sur le résultat de l'agrégation
    // Only populate additiveRef, not effects since Effect model doesn't exist
    randomProducts = await Product.populate(randomProducts, [{ path: "additives.additiveRef" }])

    res.json({ result: true, products: randomProducts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ result: false, error: "Erreur lors de la récupération de produits aléatoires" })
  }
}

/**
 * Récupérer la liste de tous les produits
 */
exports.getAllProducts = async (req, res) => {
  try {
    // Only populate additiveRef, not effects since Effect model doesn't exist
    const products = await Product.find().populate("additives.additiveRef")
    res.json({ result: true, products })
  } catch (error) {
    console.error(error)
    res.status(500).json({ result: false, error: "Erreur lors de la récupération des produits" })
  }
}
