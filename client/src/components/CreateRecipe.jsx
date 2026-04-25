import { useState, useEffect } from "react";

function CreateRecipe({ user }) {
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [servings, setServings] = useState(1);

    const [ingredientId, setIngredientId] = useState("");
    const [ingredientsList, setIngredientsList] = useState([]);
    const [amount, setAmount] = useState(1);

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
    }, []);
    
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
                        ingredients: [
                            {
                                ingredientId,
                                amount
                            }
                        ]
                    }),
                });
                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                console.log("Recipe created: ", data);
            } catch (error){
                console.error(error.message);
            }
            }

    

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

            <p>Recipe will be created by: {user.name}</p>
                <select value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}>
                <option value="">Select ingredient</option>
                {ingredientsList.map((ingredient) => (
                    <option key={ingredient._id} value={ingredient._id}>
                    {ingredient.name}
                    </option>
                ))}
            </select>

            <div>
                <input type="number" placeholder="Amount (grams)" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
            </div>
                <button type="submit">Create</button>
        </form>
        </div>
    );
};

export default CreateRecipe;