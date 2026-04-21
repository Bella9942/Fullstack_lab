const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");

router.get("/", async (req, res) => {
    try{
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    }
    catch(error) {
        res.status(500).json({error: error.message});
    }
})


router.post("/", async (req, res) => {
    try{
        const ingredient = new Ingredient(req.body);
        const savedIngredient = await ingredient.save();
        res.status(201).json(savedIngredient);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

router.delete("/:id", async (req, res) => {
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
})

router.put("/:id", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;