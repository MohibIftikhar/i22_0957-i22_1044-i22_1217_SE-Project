import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("5");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/recipes/${id}`);
                setRecipe(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recipe:", err);
                setError("Recipe not found or an error occurred.");
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            // Send the comment and rating to the server
            const res = await axios.post(`http://localhost:5000/recipes/${id}/comment`, { comment, rating });

            // Update the recipe state with the new comment
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                comments: res.data.recipe.comments // Use the updated comments from the server response
            }));

            // Reset the form
            setComment("");
            setRating("5");
        } catch (err) {
            console.error("Error submitting comment:", err);
            setError("Failed to submit comment.");
        }
    };

    // Function to trigger the print dialog
    const handlePrint = () => {
        window.print();
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
    if (!recipe) return <h2>Recipe not found!</h2>;

    return (
        <div className="recipe-details">
            <h1>{recipe.name}</h1>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <p><strong>Nutritional Info:</strong> {recipe.nutritionalInfo}</p>
            <p><strong>Method Steps:</strong></p>
            <ol>
                {recipe.methodSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
            <p><strong>YouTube Tutorial:</strong> <a href={recipe.youtubeLink} target="_blank" rel="noopener noreferrer">Watch Video</a></p>

            {/* Edit and Print Buttons */}
            <div className="recipe-actions">
                <Link to={`/edit-recipe/${recipe.id}`} className="edit-link">
                    ✏️ Edit
                </Link>
                <button onClick={handlePrint} className="print-button">
                    🖨️ Print Recipe
                </button>
            </div>

            <h3>Comments:</h3>
            {recipe.comments?.length > 0 ? (
                <ul>
                    {recipe.comments.map((c, index) => (
                        <li key={index} className="review-item">{c.comment} ⭐ {c.rating}/5</li>
                    ))}
                </ul>
            ) : (
                <p>No comments yet.</p>
            )}

            {/* Comment Form */}
            <h3>Add a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
                <label>Write your comment:</label>
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comment"
                    required
                />

                <label>Rating (1-5):</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>

                <button type="submit">Submit Comment</button>
            </form>
        </div>
    );
}

export default RecipeDetails;