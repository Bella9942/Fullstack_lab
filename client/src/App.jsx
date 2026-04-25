import { useState, useEffect } from "react";
import RecipeList from "./components/RecipeList";
import CreateRecipe from "./components/CreateRecipe";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

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

          <CreateRecipe user={user} />
          <RecipeList />
        </div>
      );
};


export default App;
