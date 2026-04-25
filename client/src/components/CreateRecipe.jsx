import { useState } from "react";

function CreateRecipe() {
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [servings, setServings] = useState(1);
    const [userId, setUserId] = useState("");
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({title, instructions, servings, userId});
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

            <div>
                <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)}/>
            </div>
                <button type="submit">Create</button>
        </form>
        </div>
    );
}

export default CreateRecipe;