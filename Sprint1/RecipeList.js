import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");

    // Load recipes from localStorage or fetch from server
    /*useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        if (storedRecipes.length > 0) {
            setRecipes(storedRecipes);
        } else {
            axios.get("http://localhost:5000/recipes")
                .then((res) => {
                    setRecipes(res.data);
                    localStorage.setItem("recipes", JSON.stringify(res.data));
                })
                .catch((err) => console.error("Error fetching recipes:", err));
        }
    }, []);
    useEffect(() => {
        axios.get("http://localhost:5000/recipes")
            .then((res) => {
                setRecipes(res.data);
                localStorage.setItem("recipes", JSON.stringify(res.data));
            })
            .catch((err) => console.error("Error fetching recipes:", err));
    }, []);*/
    useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        console.log("Stored recipes from localStorage:", storedRecipes); // Debug log
        if (storedRecipes.length > 0) {
            setRecipes(storedRecipes);
        } else {
            axios.get("http://localhost:5000/recipes")
                .then((res) => {
                    console.log("Fetched recipes from server:", res.data); // Debug log
                    setRecipes(res.data);
                    localStorage.setItem("recipes", JSON.stringify(res.data));
                })
                .catch((err) => console.error("Error fetching recipes:", err));
        }
    }, []);
    
    // Add a log before rendering
    console.log("Recipes to render:", recipes);

    // Function to delete a recipe
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/recipes/${id}`);
            
            const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
            setRecipes(updatedRecipes);
            localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    return (
        <div className="recipe-list">
            <h1>Recipe List</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search recipes by name or cuisine..."
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                className="search-bar"
            />

            {/* Recipe List */}
            <ul>
                {recipes
                    .filter(recipe => 
                        recipe.name.toLowerCase().includes(search) || 
                        recipe.cuisine.toLowerCase().includes(search)
                    )
                    .map(recipe => (
                        <li key={recipe.id} className="recipe-item">
                            <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                                {recipe.name} ({recipe.cuisine})
                            </Link>
                            <button className="delete-button" onClick={() => handleDelete(recipe.id)}>
                                🗑 Delete
                            </button>
                        </li>
                ))}
            </ul>

            {/* Add Recipe Link */}
            <Link to="/add-recipe" className="add-recipe-link">➕ Add a New Recipe</Link>
        </div>
    );
}

export default RecipeList;