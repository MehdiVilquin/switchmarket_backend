const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Veuillez entrer une adresse email valide'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    tokens: [{
      value: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
    }],
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },

    // 💖 Liste des produits likés
    likedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
