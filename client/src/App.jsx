import { useState, useEffect } from "react";
import RecipeList from "./components/RecipeList";
import CreateRecipe from "./components/CreateRecipe";
import Login from "./components/Login";
import CreateIngredient from "./components/CreateIngredient";
import IngredientList from "./components/IngredientList";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [ingredientRefresh, setIngredientRefresh] = useState(0);

  const [recipeRefresh, setRecipeRefresh] = useState(0);
  const refreshRecipes = () => {
    setRecipeRefresh((prev) => prev + 1);
  };

  const refreshIngredients = () => {
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
        <div className="app">
          <div className="header">
            <h1>Recipe Nutrion planner</h1>
            <p>Logged in as: {user?.name || "Unknown user"}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
              <div className="top-section">
          <div className="panel">
          <CreateIngredient onIngredientCreated={refreshIngredients} />
          <IngredientList ingredientRefresh={ingredientRefresh} onIngredientChanged={refreshIngredients} />       
          </div>
          <div className="panel">
            <CreateRecipe user={user} ingredientRefresh={ingredientRefresh} onRecipeCreated={refreshRecipes}/>
          </div>
        </div>

          <RecipeList recipeRefresh={recipeRefresh} />
        </div>
      );
};


export default App;
