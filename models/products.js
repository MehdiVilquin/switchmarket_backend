const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  OBFProductId: String,  // Identifiant d'origine (de products_import._id)

  product_name: String,
  brands: String,

  ingredients: [{
    text: String,
    percent: Number
  }],

  labeltags: [String],
  completion_score: String,

  additives: [{
    tag: String,              // ex: 'en:e330'
    shortName: String,        // ex: 'E330'
    additiveRef: {
      type: Schema.Types.ObjectId,
      ref: 'Additive'
    }
  }]
});

module.exports = mongoose.model('Product', ProductSchema);