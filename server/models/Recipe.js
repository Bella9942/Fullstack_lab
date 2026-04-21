const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
    instructions: {
    type: String,
    required: true,
    trim: true
  },
    servings: {
    type: Number,
    required: true,
    min: 1
  },
    userId: {
    type: mongoose.Schema.Types.ObjectId, //UserId needs to be mongodb id
    ref: "User",
    required: true
  },
  ingredients: [
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
 }],
    totalCalories: {
    type: Number,
    required: true,
    min: 0
    },
    totalProtein: {
    type: Number,
    required: true,
    min: 0
    },
    totalCarbs: {
    type: Number,
    required: true,
    min: 0
    },
    totalFats: {
    type: Number,
    required: true,
    min: 0
    }
});

module.exports = mongoose.model("Recipe", recipeSchema);