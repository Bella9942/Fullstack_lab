const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const Ingredient = require("../models/Ingredient");
const ingredients = require("./ingredients");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDb");

    await Ingredient.deleteMany
    await Ingredient.insertMany(ingredients);

    console.log("Ingredients seeded");

    mongoose.connection.close();
}).catch((error) => {
    console.error(error);
})