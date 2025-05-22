const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: Date,
      required: true,
      index: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    updatedDate: {
      type: Date,
      required: true,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
