const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/signup", createUser);

module.exports = router;