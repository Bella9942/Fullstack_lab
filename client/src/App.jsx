import { useState, useEffect } from "react";
import RecipeList from "./components/RecipeList";
import CreateRecipe from "./components/CreateRecipe";
import Login from "./components/Login";
import CreateIngredient from "./components/CreateIngredient";
import IngredientList from "./components/IngredientList";

function App() {
  const [user, setUser] = useState(null);
  const [ingredientRefresh, setIngredientRefresh] = useState(0);

  const refreshIngredients = () => {
    console.log("refreshIngredients called");
    setIngredientRefresh((prev) => prev + 1);
  };
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  
  const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  };

  if (!user) {
     return <Login setUser={setUser} />;
    }
      return (
        <div>
            <h1>Recipe Nutrion planner</h1>
            <p>Logged in as: {user?.name || "Unknown user"}</p>

            <button onClick={handleLogout}>Logout</button>
          <CreateIngredient onIngredientCreated={refreshIngredients} />
          <CreateRecipe user={user} ingredientRefresh={ingredientRefresh} />
          <IngredientList ingredientRefresh={ingredientRefresh} onIngredientChanged={refreshIngredients} />
          <RecipeList />
        </div>
      );
};


export default App;
