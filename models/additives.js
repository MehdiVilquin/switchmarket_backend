const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdditiveSchema = new Schema({
  tag: {
    type: String,
    unique: true,        // ex: 'en:e330'
    required: true
  },
  shortName: {
    type: String,        // ex: 'E330'
    required: true
  },
  name: String,          // Nom complet (ex: "Acide citrique")
  description: String,   // Description optionnelle
  origin: String,        // Végétale, synthétique, animale...
  risk: String           // ex: "controversé", "sans risque", "à éviter"
});

module.exports = mongoose.model('Additive', AdditiveSchema);