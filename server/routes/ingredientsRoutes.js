const express = require("express");
const router = express.Router();

const {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getIngredientById
} = require("../controllers/ingredientController");

router.get("/", getAllIngredients);
router.get("/:id", getIngredientById);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

module.exports = router;