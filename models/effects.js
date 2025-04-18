const mongoose = require("mongoose");

const EffectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  functions: { type: String, required: true },
  toxicity_score: { type: Number, required: true, min: 0, max: 10 },
  eco_score: { type: Number, required: true, min: 0, max: 10 },
});

module.exports = mongoose.model("Effect", EffectSchema, "effects");
