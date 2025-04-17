const mongoose = require('mongoose');
const { Schema } = mongoose;

const IngredientSchema = new Schema({
  text: { type: String, required: true },
  percent: { type: Number, required: true }
});

const AdditiveSchema = new Schema({
  tag: { type: String, required: true },
  shortName: { type: String, required: true },
  additiveRef: { type: Schema.Types.ObjectId, ref: 'Additive', required: true }
});

const ProductSchema = new Schema({
  OBFProductId: { type: String, required: true },
  product_name: { type: String, required: true },
  brands: { type: String },
  ingredients: [IngredientSchema],
  labeltags: [{ type: String,ref: 'Label' }], // anciennement : labeltags: [{ type: String }], (désormais on reference vers le modèle Label)
  completion_score: { type: String },
  additives: [AdditiveSchema],
  naturalPercentage: { type: Number, required: true },
  chemicalPercentage: { type: Number, required: true },
  effects: [{ type: Schema.Types.ObjectId, ref: 'Effect' }]
});

module.exports = mongoose.model('Product', ProductSchema,'products');
