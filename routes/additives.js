const express = require("express");
const router = express.Router();

const additiveController = require("../controllers/additiveController");

// GET /additives : récupère tous les additifs
router.get("/", additiveController.getAllAdditives);

// GET /additives/:id : récupère un additif par ID
router.get("/:id", additiveController.getAdditiveById);

// GET /additives/random : récupère des additifs aléatoires
router.get("/random/:count?", additiveController.getRandomAdditives);

module.exports = router;
