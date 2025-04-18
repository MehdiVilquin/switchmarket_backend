const Contribution = require("../models/contributions")
const Product = require("../models/products")
const mongoose = require("mongoose")

// Soumettre une nouvelle contribution
exports.submitContribution = async (req, res) => {
    try {
        const { product_name, brands, ingredients = [], labeltags = [], additives = [] } = req.body

        // Vérifier les champs obligatoires
        if (!product_name || !brands) {
            return res.status(400).json({
                result: false,
                message: "Le nom du produit et la marque sont obligatoires",
            })
        }

        // Filtrer les ingrédients vides (par sécurité côté serveur aussi)
        const filteredIngredients = ingredients.filter((ing) => ing && ing.text && ing.text.trim() !== "")

        // Créer la contribution avec l'ID de l'utilisateur connecté
        const contribution = new Contribution({
            product_name,
            brands,
            ingredients: filteredIngredients,
            labeltags,
            additives,
            submittedBy: req.user._id,
        })

        await contribution.save()

        res.status(201).json({
            result: true,
            message: "Contribution soumise avec succès",
            contribution,
        })
    } catch (error) {
        console.error("Erreur lors de la soumission de la contribution:", error)
        res.status(500).json({
            result: false,
            message: "Erreur lors de la soumission de la contribution",
        })
    }
}

// Récupérer les contributions d'un utilisateur
exports.getUserContributions = async (req, res) => {
    try {
        const contributions = await Contribution.find({ submittedBy: req.user._id })
            .sort({ submittedAt: -1 })
            .populate("additives.additiveRef")

        res.json({ result: true, contributions })
    } catch (error) {
        console.error("Erreur lors de la récupération des contributions:", error)
        res.status(500).json({
            result: false,
            message: "Erreur lors de la récupération des contributions",
        })
    }
}

// Récupérer toutes les contributions (pour les admins)
exports.getAllContributions = async (req, res) => {
    try {
        const contributions = await Contribution.find()
            .sort({ submittedAt: -1 })
            .populate("additives.additiveRef")
            .populate("submittedBy", "username email")

        res.json({ result: true, contributions })
    } catch (error) {
        console.error("Erreur lors de la récupération des contributions:", error)
        res.status(500).json({
            result: false,
            message: "Erreur lors de la récupération des contributions",
        })
    }
}

// Approuver une contribution
exports.approveContribution = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ result: false, message: "ID invalide" })
        }

        const contribution = await Contribution.findById(id)

        if (!contribution) {
            return res.status(404).json({ result: false, message: "Contribution non trouvée" })
        }

        // Mettre à jour le statut de la contribution
        contribution.status = "approved"
        contribution.reviewedBy = req.user._id
        contribution.reviewedAt = new Date()
        contribution.reviewNotes = req.body.notes || ""

        await contribution.save()

        // Créer un nouveau produit à partir de la contribution
        const newProduct = new Product({
            OBFProductId: `CONTRIB-${contribution._id}`,
            product_name: contribution.product_name,
            brands: contribution.brands,
            ingredients: contribution.ingredients,
            labeltags: contribution.labeltags,
            additives: contribution.additives,
            chemicalPercentage: 0, // À calculer ou à définir
            effects: [], // À définir
        })

        await newProduct.save()

        res.json({
            result: true,
            message: "Contribution approuvée et produit créé",
            contribution,
            product: newProduct,
        })
    } catch (error) {
        console.error("Erreur lors de l'approbation de la contribution:", error)
        res.status(500).json({
            result: false,
            message: "Erreur lors de l'approbation de la contribution",
        })
    }
}

// Rejeter une contribution
exports.rejectContribution = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ result: false, message: "ID invalide" })
        }

        const contribution = await Contribution.findById(id)

        if (!contribution) {
            return res.status(404).json({ result: false, message: "Contribution non trouvée" })
        }

        // Mettre à jour le statut de la contribution
        contribution.status = "rejected"
        contribution.reviewedBy = req.user._id
        contribution.reviewedAt = new Date()
        contribution.reviewNotes = req.body.notes || ""

        await contribution.save()

        res.json({
            result: true,
            message: "Contribution rejetée",
            contribution,
        })
    } catch (error) {
        console.error("Erreur lors du rejet de la contribution:", error)
        res.status(500).json({
            result: false,
            message: "Erreur lors du rejet de la contribution",
        })
    }
}
