const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
require("../models/User");

const validateRecipeInput = (body) => {
    const {
        title,
        instructions,
        servings,
        userId,
        ingredients,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
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

    if (
        typeof totalCalories !== "number" ||
        typeof totalProtein !== "number" ||
        typeof totalCarbs !== "number" ||
        typeof totalFat !== "number" ||
        totalCalories < 0 ||
        totalProtein < 0 ||
        totalCarbs < 0 ||
        totalFat < 0
    ) {
        return "Nutrition values must be numbers greater than or equal to 0";
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

        res.json(recipes);
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

        res.json(recipe);
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


        const recipe = new Recipe(req.body);
        const savedRecipe = await recipe.save();

        res.status(201).json(savedRecipe);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Ingredient already exists" });
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
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after", runValidators: true  }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(updatedRecipe);
    } catch (error) {
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

        res.json({ message: "Recipe deleted" });
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

        res.json(recipe.ingredients);
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

        res.json(recipes);
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