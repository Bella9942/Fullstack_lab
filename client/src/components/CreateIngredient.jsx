import { useState } from "react";

function CreateIngredient({ onIngredientCreated }) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          caloriesPer100g: calories,
          proteinPer100g: protein,
          carbsPer100g: carbs,
          fatPer100g: fat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create ingredient");
      }

      console.log("Ingredient created:", data);
      onIngredientCreated();
      setName("");
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);

    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Create Ingredient</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Protein"
          value={protein}
          onChange={(e) => setProtein(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Carbs"
          value={carbs}
          onChange={(e) => setCarbs(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Fat"
          value={fat}
          onChange={(e) => setFat(Number(e.target.value))}
        />

        <button type="submit">Create Ingredient</button>
      </form>
    </div>
  );
}

export default CreateIngredient;