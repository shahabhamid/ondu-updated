const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const messageSchema = new mongoose.Schema(
  {
    senderid: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    roomid: {
      type: String,
      required: true,
    },
    recieverid: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    fileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Message", messageSchema);
