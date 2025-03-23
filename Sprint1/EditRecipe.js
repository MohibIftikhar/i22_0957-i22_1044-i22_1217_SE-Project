import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: "",
        cuisine: "",
        cookingTime: "",
        ingredients: [],
        nutritionalInfo: "",
        methodSteps: [],
        youtubeLink: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/recipes/${id}`)
            .then(res => setRecipe(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update the recipe on the server
            await axios.put(`http://localhost:5000/recipes/${id}`, recipe);

            // Update the recipe in localStorage
            const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
            const updatedRecipes = storedRecipes.map(r => 
                r.id === id ? { ...r, ...recipe } : r
            );
            localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

            // Redirect to the home page
            navigate("/");
        } catch (err) {
            console.log("Error updating recipe:", err);
        }
    };

    return (
        <div>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleUpdate}>
                <label>Recipe Name:</label>
                <input 
                    type="text" 
                    value={recipe.name} 
                    onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} 
                />
                
                <label>Cuisine:</label>
                <input 
                    type="text" 
                    value={recipe.cuisine} 
                    onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })} 
                />

                <label>Cooking Time (minutes):</label>
                <input 
                    type="number" 
                    value={recipe.cookingTime} 
                    onChange={(e) => setRecipe({ ...recipe, cookingTime: parseInt(e.target.value) })} 
                />

                <label>Ingredients (comma-separated):</label>
                <textarea
                    value={recipe.ingredients.join(", ")}
                    onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value.split(",").map(item => item.trim()) })}
                />

                <label>Nutritional Info:</label>
                <textarea
                    value={recipe.nutritionalInfo}
                    onChange={(e) => setRecipe({ ...recipe, nutritionalInfo: e.target.value })}
                />

                <label>Method Steps (one per line):</label>
                <textarea
                    value={recipe.methodSteps.join("\n")}
                    onChange={(e) => setRecipe({ ...recipe, methodSteps: e.target.value.split("\n").map(step => step.trim()) })}
                />

                <label>YouTube Link:</label>
                <input 
                    type="url" 
                    value={recipe.youtubeLink} 
                    onChange={(e) => setRecipe({ ...recipe, youtubeLink: e.target.value })} 
                />

                <button type="submit">Update Recipe</button>
            </form>
        </div>
    );
}

export default EditRecipe;