import {useEffect, useState } from "react";

function IngredientList({ingredientRefresh, onIngredientChanged}) {
    const [ingredients, setIngredients] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedIngredientId, setSelectedIngredientId] = useState("");
    
    //--------------------------
    // FETCH INGREDIENTS
    //--------------------------
    const fetchIngredients = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/ingredients");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch ingredients");
            }

            setIngredients(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, [ingredientRefresh]);

    //--------------------------
    // DELETE RECIPE
    //--------------------------
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ingredients/${id}`, {
            method: "DELETE",
            });

            if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to delete");
            }
            setIngredients((prev) => prev.filter((ing) => ing._id !== id));
            setSelectedIngredientId("");
            onIngredientChanged();
            } catch (error) {
                console.error(error.message);
                alert(error.message);
            }
            };

    //--------------------------
    // UPDATE INGREDIENTS
    //--------------------------
const handleUpdate = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ingredients/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Update failed");
    }

    
    setIngredients((prev) =>
      prev.map((ing) => (ing._id === id ? data : ing))
    );

    setEditingId(null);

    onIngredientChanged(); 
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
};

return (
  <div>
    <h2>Manage Ingredients</h2>

    <select
      value={selectedIngredientId}
      onChange={(e) => setSelectedIngredientId(e.target.value)}
    >
      <option value="">Select ingredient</option>

      {ingredients.map((ingredient) => (
        <option key={ingredient._id} value={ingredient._id}>
          {ingredient.name}
        </option>
      ))}
    </select>

    {ingredients
      .filter((ingredient) => ingredient._id === selectedIngredientId)
      .map((ingredient) => (
        <div key={ingredient._id}>
          {editingId === ingredient._id ? (
            <div>
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />

              <input type="number" value={editData.caloriesPer100g}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    caloriesPer100g: Number(e.target.value),
                  })
                }
              />

              <input type="number" value={editData.proteinPer100g}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    proteinPer100g: Number(e.target.value),
                  })
                }
              />

              <input type="number" value={editData.carbsPer100g}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    carbsPer100g: Number(e.target.value),
                  })
                }/>

              <input type="number" value={editData.fatPer100g}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    fatPer100g: Number(e.target.value),
                  })
                }/>
              <button onClick={() => handleUpdate(ingredient._id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h3>{ingredient.name}</h3>
              <p>Calories: {ingredient.caloriesPer100g}</p>
              <p>Protein: {ingredient.proteinPer100g}g</p>
              <p>Carbs: {ingredient.carbsPer100g}g</p>
              <p>Fat: {ingredient.fatPer100g}g</p>

              <button className="edit-btn"
                onClick={() => {
                  setEditingId(ingredient._id);
                  setEditData(ingredient);
                }}
              >Edit</button>

              <button className = "delete-btn" onClick={() => handleDelete(ingredient._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
  </div>
);
}

export default IngredientList;