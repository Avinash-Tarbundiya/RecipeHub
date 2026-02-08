const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // URL or relative path
  category: { type: String },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
