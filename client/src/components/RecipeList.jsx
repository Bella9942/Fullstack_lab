import { useEffect, useState } from "react";

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/recipes")
        .then((response) => {
            if (!response.ok){
                throw new Error("Could not fetch recipes")
            }
            return response.json()
    })        
    .then((data) => {
            setRecipes(data);
            setLoading(false);
        })
    .catch((error) => {
        setError(error.message);
        setLoading(false);
    });
    }, []);
    if (loading) {
        return <p>Loading recipes...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Recipes</h2>
            {recipes.map((recipe) =>(
            <div key={recipe._id}>
                <h3>{recipe.title}</h3>
                <p>Servings: {recipe.servings}</p>
                <p>Calories: {recipe.totalCalories}</p> 
            
            </div>
        ))}
        </div>
    )
}

export default RecipeList;