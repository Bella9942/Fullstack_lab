import { useEffect, useState } from "react";

function RecipeList({ recipeRefresh }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [search, setSearch] = useState("");
    
    useEffect(() => {

        const fetchRecipes = () => {
        setLoading(true);
        setError("");
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
    };
    fetchRecipes();

    const intervalId = setInterval(fetchRecipes, 10000);
    return () => clearInterval(intervalId);

    }, [recipeRefresh]);
    //--------------------------
    // DELETE RECIPE
    //--------------------------
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");

        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
            method: "DELETE",
            });

            if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to delete recipe");
            }

            setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
        };

    const handleUpdate = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData),
            });

            const data = await response.json();

            if (!response.ok) {
            throw new Error(data.error || "Update failed");
            }

            
            setRecipes((prev) =>
            prev.map((recipe) => (recipe._id === id ? data : recipe))
            );

            setEditingId(null);

        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
        };

    return (
        <div>
            <h2>Recipes</h2>
            <input type="text" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(search.toLowerCase())
            ).map((recipe) => (
            <div key={recipe._id}>

                {editingId === recipe._id ? (
      
        <div>
            <input value={editData.title}
            onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
            }
            />

            <input type="number" value={editData.servings}
            onChange={(e) =>
                setEditData({
                ...editData,
                servings: Number(e.target.value),
                })
            }
            />

            <input value={editData.instructions}
            onChange={(e) =>
                setEditData({ ...editData, instructions: e.target.value })
            }
            />

            <button onClick={() => handleUpdate(recipe._id)}>Save</button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>

        ) : (
                <div key={recipe._id}>
                    <h3>{recipe.title}</h3>
                    <p>Servings: {recipe.servings}</p>
                    <p>Calories: {recipe.totalCalories}</p> 
                    <p>Protein: {recipe.totalProtein}</p>
                    <p>Carbs: {recipe.totalCarbs}</p>
                    <p>Fat: {recipe.totalFat}</p> 
                    <p>Created by: {recipe.userId?.name}</p>
                    <button onClick={() => {
                        setEditingId(recipe._id);
                        setEditData({
                        ...recipe,
                        userId: recipe.userId?._id,
                        ingredients: recipe.ingredients.map((item) => ({
                        ingredientId: item.ingredientId?._id,
                        amount: item.amount}))});}}>Edit</button>

                    <button onClick={() => handleDelete(recipe._id)}>Delete</button>
                    
                       </div>
                )}
            </div>
            ))}
        </div>
        );
        }
                



export default RecipeList;