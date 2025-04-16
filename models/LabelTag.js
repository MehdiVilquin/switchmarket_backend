const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabelTagSchema = new Schema({
    _id: { type: String, required: true }, // Exemple : "tag-vegan"
    canonical: { type: String, required: true }, // Label principal (ex. "Vegan")
    synonyms: [{ type: String }], // Liste des variantes trouvées (ex. "vegan-friendly", "plant-based", etc.)
    categories: [{ type: String }], // Catégorisation (ex. "Ethical", "Diet", etc.)
    description: { type: String }
});

module.exports = mongoose.model('LabelTag', LabelTagSchema);
