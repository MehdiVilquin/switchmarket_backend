const express = require("express")
const router = express.Router()
const contributionController = require("../controllers/contributionController")
const auth = require("../middlewares/auth")
const isAdmin = require("../middlewares/isAdmin")

// Route pour soumettre une nouvelle contribution (utilisateur connecté)
router.post("/", auth, contributionController.submitContribution)

// Route pour récupérer les contributions de l'utilisateur connecté
router.get("/me", auth, contributionController.getUserContributions)

// Route pour récupérer toutes les contributions (admin seulement)
router.get("/", auth, isAdmin, contributionController.getAllContributions)

// Route pour approuver une contribution (admin seulement)
router.put("/:id/approve", auth, isAdmin, contributionController.approveContribution)

// Route pour rejeter une contribution (admin seulement)
router.put("/:id/reject", auth, isAdmin, contributionController.rejectContribution)

module.exports = router
