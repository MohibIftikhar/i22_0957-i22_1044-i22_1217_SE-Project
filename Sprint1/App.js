import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            </Routes>
        </Router>
    );
}

export default App;