const mongoose = require("mongoose")
const { Schema } = mongoose

const IngredientSchema = new Schema({
    text: { type: String, required: true },
    percent: { type: Number, default: 0 },
})

const AdditiveSchema = new Schema({
    tag: { type: String, required: true },
    shortName: { type: String, required: true },
    additiveRef: { type: Schema.Types.ObjectId, ref: "Additive", required: true },
})

const ContributionSchema = new Schema(
    {
        product_name: { type: String, required: true },
        brands: { type: String, required: true },
        ingredients: [IngredientSchema],
        labeltags: [{ type: String, ref: "Label" }],
        additives: [AdditiveSchema],
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        submittedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: Date,
        reviewNotes: String,
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model("Contribution", ContributionSchema, "contributions")
