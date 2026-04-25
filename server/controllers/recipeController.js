const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
require("../models/User");

const calculateNutrition = async (ingredients) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const item of ingredients) {
        const ingredient = await Ingredient.findById(item.ingredientId);

        if (!ingredient) {
            throw new Error("Ingredient not found");
        }
        const multiplier = item.amount / 100;

        totalCalories += ingredient.caloriesPer100g * multiplier;
        totalProtein += ingredient.proteinPer100g * multiplier;
        totalCarbs += ingredient.carbsPer100g * multiplier;
        totalFat += ingredient.fatPer100g * multiplier;
    }

    return {
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat)
    };      
}

const validateRecipeInput = (body) => {
    const {
        title,
        instructions,
        servings,
        userId,
        ingredients
    } = body;

    if (!title || typeof title !== "string") {
        return "Title is required and must be a string";
    }

    if (!instructions || typeof instructions !== "string") {
        return "Instructions are required and must be a string";
    }

    if (typeof servings !== "number" || servings < 1) {
        return "Servings must be a number and at least 1";
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return "Invalid user id";
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return "Ingredients must be a non-empty array";
    }

    for (const item of ingredients) {
        if (!mongoose.Types.ObjectId.isValid(item.ingredientId)) {
            return "Each ingredient must have a valid ingredientId";
        }

        if (typeof item.amount !== "number" || item.amount < 0) {
            return "Each ingredient amount must be a number >= 0";
        }
    }

    return null;
};

const getAllRecipes = async (req, res) => {
    try {
        const filter = {};
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: "i" };
        }
        const recipes = await Recipe.find(filter).populate("ingredients.ingredientId");

        if (!recipes.length) {
            return res.status(404).json({ error: "No recipes found" });
        }

        return res.json(recipes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getRecipeById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid recipe id" });
        }

        const recipe = await Recipe.findById(req.params.id)
            .populate("ingredients.ingredientId")
            .populate("userId");

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        const recipeObject = recipe.toObject();

        const recipePerServing = {
            ...recipeObject,
            caloriesPerServing: Math.round(recipe.totalCalories / recipe.servings),
            proteinPerServing: Math.round(recipe.totalProtein / recipe.servings),
            carbsPerServing: Math.round(recipe.totalCarbs / recipe.servings),
            fatPerServing: Math.round(recipe.totalFat / recipe.servings)
        };

        return res.json(recipePerServing);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createRecipe = async (req, res) => {
    try {
        const validationError = validateRecipeInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const nutrition = await calculateNutrition(req.body.ingredients);
        
        const recipe = new Recipe({
            ...req.body, 
            ...nutrition});
        const savedRecipe = await recipe.save();

        return res.status(201).json(savedRecipe);
    } catch (error) {
        if (error.message === "Ingredient not found") {
            return res.status(404).json({ error: error.message });
        }

        if (error.code === 11000) {
            return res.status(409).json({ error: "Recipe already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
       return res.status(500).json({ error: "Internal server error" });
    }
};

const updateRecipe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid recipe id" });
        }
        const validationError = validateRecipeInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const nutrition = await calculateNutrition(req.body.ingredients);

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,{
              ...req.body, 
              ...nutrition 
            },
            { returnDocument: "after", runValidators: true  }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        return res.json(updatedRecipe);
    } catch (error) {
        if (error.message === "Ingredient not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({ error: "Recipe already exists" });
        }
        if (error.name === "ValidationError") {
           return res.status(400).json({ error: error.message });
        }
         return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid recipe id" });
        }

        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!deletedRecipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        return res.json({ message: "Recipe deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getRecipeIngredients = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid recipe id" });
        }

        const recipe = await Recipe.findById(req.params.id)
            .populate("ingredients.ingredientId");

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        return res.json(recipe.ingredients);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getRecipesByUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const recipes = await Recipe.find({ userId: req.params.id })
            .populate("ingredients.ingredientId");

        if (!recipes.length) {
            return res.status(404).json({ error: "No recipes found for this user" });
        }

       return res.json(recipes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeIngredients,
    getRecipesByUser
};