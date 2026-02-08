const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Get all recipes (with optional search & category)
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (q) filter.name = { $regex: q, $options: 'i' };
    const list = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new recipe (admin)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const recipe = new Recipe(data);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Update recipe (admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// Delete recipe (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Add a review to a recipe
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, comment, rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });

    recipe.reviews.push({ user, comment, rating });
    // update average rating
    const sum = recipe.reviews.reduce((s, r) => s + (r.rating || 0), 0);
    recipe.rating = +(sum / recipe.reviews.length).toFixed(1);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: 'Could not add review' });
  }
});

module.exports = router;
