const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Load recipes from JSON file
let recipes = [];
const dataPath = "./recipes.json";

/*if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath);
    recipes = JSON.parse(rawData);
}*/
if (fs.existsSync(dataPath)) {
    try {
        const rawData = fs.readFileSync(dataPath);
        recipes = JSON.parse(rawData);
        console.log("Recipes loaded:", recipes); // Debug log
    } catch (err) {
        console.error("Error parsing recipes.json:", err);
        recipes = [];
    }
}

// Get all recipes
app.get("/recipes", (req, res) => {
    console.log("Serving recipes:", recipes); // Debug log
    res.json(recipes);
});

// Save recipes to JSON file
const saveRecipes = () => {
    fs.writeFileSync(dataPath, JSON.stringify(recipes, null, 2));
};

// Get all recipes
app.get("/recipes", (req, res) => {
    res.json(recipes);
});

// Get a single recipe by ID
app.get("/recipes/:id", (req, res) => {
    const recipe = recipes.find(r => r.id == req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
});

// Add a new recipe
app.post("/recipes", (req, res) => {
    const newRecipe = {
        id: recipes.length + 1,
        ...req.body
    };
    recipes.push(newRecipe);
    saveRecipes();
    res.status(201).json(newRecipe);
});

// Update a recipe
app.put("/recipes/:id", (req, res) => {
    const recipeIndex = recipes.findIndex(r => r.id == req.params.id);
    if (recipeIndex === -1) return res.status(404).json({ message: "Recipe not found" });

    recipes[recipeIndex] = { ...recipes[recipeIndex], ...req.body };
    saveRecipes();
    res.json(recipes[recipeIndex]);
});

// Delete a recipe
app.delete("/recipes/:id", (req, res) => {
    const recipeIndex = recipes.findIndex(r => r.id == req.params.id);
    if (recipeIndex === -1) return res.status(404).json({ message: "Recipe not found" });

    recipes.splice(recipeIndex, 1);
    saveRecipes();
    res.status(204).send();
});

// Add a comment to a recipe
app.post("/recipes/:id/comment", (req, res) => {
    const recipe = recipes.find(r => r.id == req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const newComment = { comment: req.body.comment, rating: req.body.rating };
    recipe.comments = [...(recipe.comments || []), newComment];
    saveRecipes();
    res.json({ recipe });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});