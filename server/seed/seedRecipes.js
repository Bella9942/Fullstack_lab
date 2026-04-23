const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDb");

  await Recipe.deleteMany();

  const users = await User.find();
  const ingredients = await Ingredient.find();

  const recipes = [
    {
        title:"Chicken Rice Bowl",
        instructions: "Step 1: Cook rice and chicken. Step 2: then mix together.",
        servings: 2,
        userId: users[0]._id,
        ingredients: [
            {
                ingredientId: ingredients.find(i => i.name === "Chicken breast")._id,
                amount: 200
            },
            {
            ingredientId: ingredients.find(i => i.name === "Brown rice")._id,
            amount: 150
            }
        ],
        totalCalories: 600,
        totalProtein: 50,
        totalCarbs: 45,
        totalFat: 10
    },
    {
      title: "Avocado Yogurt Bowl",
      instructions: "Step 1: Dice the avocado. Step 2: Mix avocado and yogurt.",
      servings: 1,
      userId: users[1]._id,
      ingredients: [
        {
          ingredientId: ingredients.find(i => i.name === "Avocado")._id,
          amount: 100
        },
        {
          ingredientId: ingredients.find(i => i.name === "Greek yogurt")._id,
          amount: 150
        }
      ],
      totalCalories: 300,
      totalProtein: 15,
      totalCarbs: 20,
      totalFat: 18
    },
     {
      title: "Broccoli Chicken",
      instructions: "Step 1: Cook broccoli and chicken together.",
      servings: 2,
      userId: users[2]._id,
      ingredients: [
        {
          ingredientId: ingredients.find(i => i.name === "Chicken breast")._id,
          amount: 150
        },
        {
          ingredientId: ingredients.find(i => i.name === "Broccoli")._id,
          amount: 100
        }
      ],
      totalCalories: 400,
      totalProtein: 40,
      totalCarbs: 10,
      totalFat: 8
    },
    {
      title: "Rice Yogurt Bowl",
      instructions: "Step 1: Cook the rice. Step 2: Mix rice and yogurt.",
      servings: 2,
      userId: users[3]._id,
      ingredients: [
        {
          ingredientId: ingredients.find(i => i.name === "Brown rice")._id,
          amount: 200
        },
        {
          ingredientId: ingredients.find(i => i.name === "Greek yogurt")._id,
          amount: 100
        }
      ],
      totalCalories: 350,
      totalProtein: 12,
      totalCarbs: 50,
      totalFat: 5
    },
    {
      title: "Simple Avocado Snack",
      instructions: "Step 1: Eat avocado.",
      servings: 1,
      userId: users[4]._id,
      ingredients: [
        {
          ingredientId: ingredients.find(i => i.name === "Avocado")._id,
          amount: 150
        }
    ],
    totalCalories: 240,
    totalProtein: 3,
    totalCarbs: 12,
    totalFat: 22
    }
  ]
  await Recipe.insertMany(recipes);

  console.log("Recipes seeded!");
    mongoose.connection.close();
}).catch((error) => {
    console.error(error);
})