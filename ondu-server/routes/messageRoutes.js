const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Message = mongoose.model("Message");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");

const fs = require("fs");
fs.access("uploads", fs.constants.R_OK, (err) => {
  if (err) {
    fs.mkdirSync("uploads");
    const uploadsPath = path.resolve("uploads/messages");
    console.log(uploadsPath);
    console.log("file is not readable");
  } else {
    console.log("file is readable");
    const uploadsPath = path.resolve("uploads/messages");
    console.log(uploadsPath);
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/messages");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/savemessagetodb", upload.single("image"), async (req, res) => {
  const {
    senderid,
    message,
    roomid,
    recieverid,
    type,
    mimeType,
    fileName,
    deviceToken,
  } = req.body;
  console.log("MESSAGE RECEIVED - ", req.body);

  try {
    const newMessage = new Message({
      senderid,
      message,
      roomid,
      recieverid,
      type,
      mimeType,
      deviceToken,
      fileName,
    });
    await newMessage.save();
    res.send({ message: "Message saved successfully" });
    console.log(res.json());
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post("/getmessages", async (req, res) => {
  const { roomid } = req.body;
  //console.log("ROOM ID RECEIVED - ", roomid);

  Message.find({ roomid: roomid })
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/setusermessages", async (req, res) => {
  const { ouruserid, fuserid, lastmessage, roomid, type, mimeType, fileName } =
    req.body;
  console.log("MESSAGE ID RECEIVED - ", fuserid);
  User.findOne({ _id: ouruserid })
    .then((user) => {
      // user.allMessages.map((item) => {
      //   if (item.fuserid == fuserid) {
      //     user.allMessages.pull(item);
      //   }
      // });
      const date = Date.now();
      user.allMessages.push({
        ouruserid,
        fuserid,
        lastmessage,
        roomid,
        date,
        type,
        mimeType,
        fileName,
      });
      user.save();
      res.status(200).send({ message: "Message saved successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

router.post("/getusermessages", async (req, res) => {
  const { userid } = req.body;
  console.log("USER ID RECEIVED - ", userid);
  User.findOne({ _id: userid })
    .then((user) => {
      res.status(200).send(user.allMessages);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send(err.message);
    });
});

module.exports = router;
