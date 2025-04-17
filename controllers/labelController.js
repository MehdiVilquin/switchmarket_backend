const Label = require("../models/labels")
const mongoose = require("mongoose")

/**
 * Récupérer tous les labels et les catégories associées
 * Renvoie un objet contenant les labels et les catégories
 */

exports.getLabels = async (req, res) => {
    try {
      const labels = await Label.find().lean();
  
      const categories = {};
      const labelMap = {};
  
      for (const label of labels) {
        labelMap[label._id] = label;
  
        for (const category of label.categories) {
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(label._id);
        }
      }
  
      res.json({
        result: true,
        categories,
        labels: labelMap
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des labels :", error);
      res.status(500).json({ result: false, error: "Erreur serveur" });
    }
  };
