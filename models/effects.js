const mongoose = require("mongoose");
const { Schema } = mongoose;

const EffectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  functions: { type: String, required: true }, //
  toxicity_score: { type: Number, required: true, min: -10, max: 10 },
  eco_score: { type: Number, required: true, min: -10, max: 10 },
});

module.exports = mongoose.model("Effect", EffectSchema, "effects");
