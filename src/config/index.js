require("dotenv").config(); // Load environment variables from .env
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

module.exports = mongoose.connect(mongoUri);