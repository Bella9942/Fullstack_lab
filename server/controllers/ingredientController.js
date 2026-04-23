const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");

const getAllIngredients = async (req, res) => {
    try{
        const ingredients = await Ingredient.find();
        if (!ingredients.length) {
            return res.status(404).json({ error: "No ingredients found" });
        }
        res.json(ingredients);
    }
    catch(error) {
        res.status(500).json({error: error.message});
    }
};

const getIngredientById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ingredient id" });
        }

        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({ error: "Ingredient not found" });
        }

        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createIngredient = async (req, res) => {
    try{
        const ingredient = new Ingredient(req.body);
        const savedIngredient = await ingredient.save();
        res.status(201).json(savedIngredient);
    }
    catch(error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Ingredient already exists" });
        }
        if (error.name === "ValidationError") {
            res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateIngredient = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ingredient id" });
        }

        const updatedIngredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!updatedIngredient){
            return res.status(404).json({ error: "Ingredient not found" });
        }

        res.json(updatedIngredient);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Ingredient already exists" });
        }
        if (error.name === "ValidationError") {
            res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteIngredient = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ingredient id" });
        }

        const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.id);

        if (!deletedIngredient){
            return res.status(404).json({ error: "Ingredient not found" });
        }

        res.json({message: "Ingredient deleted"});
    }
    catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
};