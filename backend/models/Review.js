const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    user: { type: String },
    comment: { type: String },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);
