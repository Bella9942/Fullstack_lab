const express = require("express");
const moongoose = require("mongoose")
const Ingredient = require("./models/Ingredient");
const recipeRoutes = require("./routes/recipeRoutes");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const ingredientRoutes = require("./routes/ingredientsRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


mongoose
    .connect(process.env.MONGO_URI).then (()=>{
    console.log("Connected to Mongodb atlas");

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    })