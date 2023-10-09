const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const imgSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

mongoose.model("img", imgSchema);
