const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    value: {
      type: Boolean, // true = vote positif, false = retrait (ou vote négatif si tu veux le développer plus tard)
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vote', voteSchema);