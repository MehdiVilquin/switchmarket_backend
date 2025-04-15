const express = require("express")
const router = express.Router()

const additiveController = require("../controllers/additiveController")

// GET /additives : récupère tous les additifs
router.get("/", additiveController.getAllAdditives)

// GET /additives/random/:count? : récupère des additifs aléatoires
router.get("/random/:count?", additiveController.getRandomAdditives)

// GET /additives/tag/:tag : récupère des additifs par tag
router.get("/tag/:tag", additiveController.getAdditivesByTag)

// GET /additives/category/:category : récupère des additifs par catégorie
router.get("/category/:category", additiveController.getAdditivesByCategory)

// GET /additives/:id : récupère un additif par ID (keep this last)
router.get("/:id", additiveController.getAdditiveById)

module.exports = router
