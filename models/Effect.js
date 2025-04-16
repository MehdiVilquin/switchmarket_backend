const mongoose = require('mongoose');
const { Schema } = mongoose;

const EffectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  score: { type: Number, required: true, min: -10, max: 10 }
});

module.exports = mongoose.model('Effect', EffectSchema);
