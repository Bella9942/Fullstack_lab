import RecipeList from "./components/RecipeList";
import CreateRecipe from "./components/CreateRecipe";

function App() {
  return (
    <div>
        <h1>Recipe Nutrion planner</h1>
      <CreateRecipe />
      <RecipeList />
    </div>
  );
}

export default App;
