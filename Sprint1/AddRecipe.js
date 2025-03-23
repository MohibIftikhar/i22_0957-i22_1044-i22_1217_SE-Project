import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
    const [name, setName] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [nutritionalInfo, setNutritionalInfo] = useState("");
    const [methodSteps, setMethodSteps] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !cuisine.trim() || !cookingTime || !ingredients.trim()) {
            setError("Name, Cuisine, Cooking Time, and Ingredients are required!");
            return;
        }

        try {
            // Send recipe data to the server
            const response = await axios.post("http://localhost:5000/recipes", { 
                name, 
                cuisine, 
                cookingTime: parseInt(cookingTime), 
                ingredients: ingredients.split(",").map(item => item.trim()), 
                nutritionalInfo, 
                rating: 0, 
                reviews: [], 
                comments: [], 
                methodSteps: methodSteps.split("\n").map(step => step.trim()), 
                youtubeLink 
            });

            if (response.status === 201) {
                const newRecipe = response.data; // Use the recipe object returned by the server

                // Update localStorage with the newly added recipe
                const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
                localStorage.setItem("recipes", JSON.stringify([...storedRecipes, newRecipe]));

                // Reset form fields
                setName("");
                setCuisine("");
                setCookingTime("");
                setIngredients("");
                setNutritionalInfo("");
                setMethodSteps("");
                setYoutubeLink("");

                // Redirect to recipe list
                navigate("/");
            } else {
                setError("Failed to add recipe. Server error.");
            }
        } catch (err) {
            setError("Failed to add recipe. Please try again.");
            console.error("Error adding recipe:", err);
        }
    };

    return (
        <div>
            <h2>Add a New Recipe</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Recipe Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter recipe name"
                />
                
                <label>Cuisine:</label>
                <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="Enter cuisine"
                />

                <label>Cooking Time (minutes):</label>
                <input
                    type="number"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    placeholder="Enter cooking time"
                />

                <label>Ingredients (comma-separated):</label>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (e.g., flour, sugar, eggs)"
                />

                <label>Nutritional Info:</label>
                <textarea
                    value={nutritionalInfo}
                    onChange={(e) => setNutritionalInfo(e.target.value)}
                    placeholder="Enter nutritional info (e.g., Calories: 500, Protein: 20g)"
                />

                <label>Method Steps (one per line):</label>
                <textarea
                    value={methodSteps}
                    onChange={(e) => setMethodSteps(e.target.value)}
                    placeholder="Enter method steps (one per line)"
                />

                <label>YouTube Link:</label>
                <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Enter YouTube link"
                />
                
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
}

export default AddRecipe;