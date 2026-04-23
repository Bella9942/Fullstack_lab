const express = require("express");
const router = express.Router();
const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeIngredients,
    getRecipesByUser
} = require("../controllers/recipeController");

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);
router.get("/:id/ingredients", getRecipeIngredients);
router.get("/users/:id/recipes", getRecipesByUser);
module.exports = router;