import { useState, useEffect } from "react";

function CreateRecipe({ user, ingredientRefresh, onRecipeCreated  }) {
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [servings, setServings] = useState(1);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([{ ingredientId: "", amount: "" }]);

    useEffect(() => {
        const fetchIngredients = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/ingredients");
            const data = await response.json();
            setIngredientsList(data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchIngredients();
    }, [ingredientRefresh]);



    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                    body: JSON.stringify({
                        title,
                        instructions,
                        servings,
                        userId: user._id,
                        ingredients: recipeIngredients
                    }),
                });
                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                window.alert("Recipe created");
                onRecipeCreated();
            } catch (error){
                console.error(error.message);
            }
            }

    const addIngredientRow = () => {
        setRecipeIngredients([
            ...recipeIngredients,
            { ingredientId: "", amount: "" }
        ]);
        };

        const updateIngredientRow = (index, field, value) => {
            const updated = [...recipeIngredients];
            updated[index][field] = field === "amount" ? (value === "" ? "" : Number(value)) : value;
            setRecipeIngredients(updated);
            };

        const removeIngredientRow = (index) => {
            setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
        };

    return(
        <div>
            <h2>Create Recipe</h2>

            <form onSubmit={handleSubmit}>
            <div>
                <input type="text" placeholder="Recipe title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div>
            <input type="text" placeholder="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}/>
            </div>

            <div>
            <input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value))}/>
            </div>
            
            {recipeIngredients.map((item, index) => (
                <div key={index}>
                    <select
                    value={item.ingredientId}
                    onChange={(e) =>
                        updateIngredientRow(index, "ingredientId", e.target.value)
                    }
                    >
                    <option value="">Select ingredient</option>
                    {ingredientsList.map((ingredient) => (
                        <option key={ingredient._id} value={ingredient._id}>
                        {ingredient.name}
                        </option>
                    ))}
                    </select>

                    <input type="number" placeholder="Amount (grams)" value={item.amount}
                    onChange={(e) =>
                        updateIngredientRow(index, "amount", e.target.value)
                    }
                    />

                    <button className= "delete-btn" type="button" onClick={() => removeIngredientRow(index)}>Remove</button>
                </div>
                ))}

                <button type="button" onClick={addIngredientRow}>Add ingredient</button>

                <button type="submit">Create</button>
        </form>
        </div>
    );
};

export default CreateRecipe;