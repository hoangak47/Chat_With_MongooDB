const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("token", tokenSchema);
