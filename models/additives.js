import mongoose from "mongoose";

const additiveSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, unique: true },
    shortName: { type: String },

    name: {
      fr: { type: String },
      uk: { type: String },
    },

    description: {
      fr: { type: String },
      uk: { type: String },
    },

    origin: { type: String },
    risk: { type: String },
    fonction: { type: String },
    famille: { type: String },
    exemples_produits: { type: String },
    dja: { type: String },
    allergie_possible: { type: String, enum: ["Oui", "Non"] },
    commentaire: { type: String },
    note: { type: String },
  },
  {
    collection: "additives",
  }
);

export default mongoose.model("Additive", additiveSchema);
