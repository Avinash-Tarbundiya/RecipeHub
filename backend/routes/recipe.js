const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const Review = require("../models/Review");

// Get all recipes (for homepage random cards)
router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch(err) {
        res.status(500).json({message: "Server error"});
    }
});

// Get single recipe by ID (for recipe detail page)
router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.json(recipe);
    } catch(err) {
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;
