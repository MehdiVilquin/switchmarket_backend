const express = require("express");
const router = express.Router();

const effectcontroller = require("../controllers/effectcontroller");

// GET /effects : récupère tous les effets
router.get("/", effectcontroller.getAllEffects);

// GET /effects/search : recherche des effets par nom
router.get("/search", effectcontroller.getEffectsByName);

// GET /effects/:id : récupère un effet par ID
router.get("/:id", effectcontroller.getEffectById);

module.exports = router;
