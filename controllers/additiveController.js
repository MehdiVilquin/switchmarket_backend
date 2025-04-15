const Additive = require("../models/additives");
const mongoose = require("mongoose");

// GET all additives
exports.getAllAdditives = async (req, res) => {
    try {
        const additives = await Additive.find();
        res.json({ result: true, additives });
    } catch (error) {
        res.status(500).json({ result: false, error: "Erreur lors de la récupération des additifs" });
    }
};

// GET additive by ID
exports.getAdditiveById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ result: false, message: "ID invalide" });
    }

    try {
        const additive = await Additive.findById(id);

        if (!additive) {
            return res.status(404).json({ result: false, message: "Additif non trouvé" });
        }

        res.json({ result: true, additive });
    } catch (error) {
        res.status(500).json({ result: false, error: "Erreur serveur" });
    }
};

// GET random additives
exports.getRandomAdditives = async (req, res) => {
    const count = parseInt(req.params.count) || 6;

    try {
        const randomAdditives = await Additive.aggregate([{ $sample: { size: count } }]);
        res.json({ result: true, additives: randomAdditives });
    } catch (error) {
        res.status(500).json({ result: false, error: "Erreur lors de la récupération aléatoire" });
    }
};
