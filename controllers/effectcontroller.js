const Effect = require("../models/effects");
const mongoose = require("mongoose");

// GET all effects
exports.getAllEffects = async (req, res) => {
  try {
    const effects = await Effect.find();
    res.json({ result: true, effects });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: "Erreur lors de la récupération des effets",
    });
  }
};

// GET effect by ID
exports.getEffectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      result: false,
      message: "ID invalide",
    });
  }

  try {
    const effect = await Effect.findById(id);

    if (!effect) {
      return res.status(404).json({
        result: false,
        message: "Effet non trouvé",
      });
    }

    res.json({ result: true, effect });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: "Erreur serveur",
    });
  }
};

// GET effects by name (search)
exports.getEffectsByName = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      result: false,
      message: "Paramètre de recherche manquant",
    });
  }

  try {
    const effects = await Effect.find({
      name: { $regex: query, $options: "i" },
    });

    res.json({
      result: true,
      effects,
      count: effects.length,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: "Erreur lors de la recherche des effets",
    });
  }
};
