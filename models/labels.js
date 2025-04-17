const mongoose = require('mongoose');
const { Schema } = mongoose;

// Liste des catégories autorisées, utilisées pour valider le champ "categories"
const VALID_CATEGORIES = [
  'Ethical',         // éthique : vegan, cruelty-free, etc.
  'Political',       // politique : boycott, soutien, etc.
  'Ecological',      // écologique : recyclable, sans plastique, etc.
  'Health',          // santé : hypoallergenic, sans parabènes, etc.
  'Sustainability',  // durabilité : compostable, refillable, etc.
  'Certification',   // labels officiels : Ecocert, B Corp, etc.
  'Diet',            // régimes : gluten-free, vegan, etc.
  'Marketing',       // allégations marketing : clean beauty, artisanal...
  'Legal',           // mentions légales : FDA approved, EU compliant
  'Origin'           // origine : made in France, local, cold-pressed...
];

// Schéma Mongoose pour la collection "labels"
const LabelSchema = new Schema({
  _id: {
    type: String,             // identifiant canonique du tag, ex: "vegan"
    required: true,
    trim: true
  },
  canonical: {
    type: String,             // nom affiché à l’utilisateur, ex: "Vegan"
    required: true,
    trim: true
  },
  synonyms: {
    type: [String],           // variantes textuelles du tag
    default: []
  },
  categories: {
    type: [String],           // tableau de catégories validées
    enum: VALID_CATEGORIES,
    required: true
  },
  description: {
    type: String,             // courte explication affichable dans l’interface
    required: true,
    trim: true
  },
  url_info: {
    type: String,             // lien vers une ressource explicative (Wikipedia ou autre)
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL`
    }
  }
}, {
  collection: 'labels'         // nom explicite de la collection MongoDB
});

module.exports = mongoose.model('Label', LabelSchema);

