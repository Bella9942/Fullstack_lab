const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const User = require("../models/User");
const users = require("./users")

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDb");

    await User.deleteMany();
    await User.insertMany(users);

    console.log("Users seeded");

    mongoose.connection.close();
}).catch((error) => {
    console.error(error);
})