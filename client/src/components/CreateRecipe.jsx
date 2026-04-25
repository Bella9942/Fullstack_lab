import { useState } from "react";

function CreateRecipe() {
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [servings, setServings] = useState(1);
    const [userId, setUserId] = useState("");
    
    const [ingredientId, setIngredientId] = useState("");
    const [amount, setAmount] = useState(0);
    
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
                        userId,
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

            <div>
                <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)}/>
            </div>
            <div>
                <input type="text" placeholder="Ingredient ID" value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}/>
                </div>

            <div>
                <input type="number" placeholder="Amount (grams)" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
            </div>
                <button type="submit">Create</button>
        </form>
        </div>
    );
};

export default CreateRecipe;