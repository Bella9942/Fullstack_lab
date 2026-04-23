const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  caloriesPer100g: {
    type: Number,
    required: true,
    min: 0
  },
    proteinPer100g: {
    type: Number,
    required: true,
    min: 0
  },
    carbsPer100g: {
    type: Number,
    required: true,
    min: 0
  },
    fatPer100g: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);