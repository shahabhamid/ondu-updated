const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

fs.access("uploads", fs.constants.R_OK, (err) => {
  if (err) {
    fs.mkdirSync("uploads");
    const uploadsPath = path.resolve("uploads");
    console.log(uploadsPath);
    console.log("file is not readable");
  } else {
    console.log("file is readable");
    const uploadsPath = path.resolve("uploads");
    console.log(uploadsPath);
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/uploadimage", upload.single("image"), async (req, res) => {
  const { email, name } = req.body;
  console.log(req.body.name);
  const uploadsPath = path.resolve("uploads");

  try {
    // const filepath = path.join(__dirname, "uploads", req.file.originalname);
    // console.log(filepath);
    if (!req.file) {
      res.send({ code: 500, msg: "err" });
    } else {
      User.findOne({ email: email }).then(async (savedUser) => {
        if (savedUser) {
          savedUser.profile_pic_name = name;
          savedUser
            .save()
            .then((user) => {
              res.json({ message: "Profile Pic Changed Successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return res.status(422).json({ error: "Invalid Credentials" });
        }
      });
      // User.findByIdAndUpdate({ _id: userId }).then((savedUser) => {
      //   console.log(savedUser);
      //   savedUser.profile_pic_name = req.file.originalname;
      //   savedUser.save();
      // });
      // res.send({ code: 200, msg: "Success" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.get("/fetchImage/:file(*)", (req, res) => {
  let file = req.params.file;
  const uploadsPath = path.resolve("uploads");
  console.log(file);
  let fileLocation = path.join(uploadsPath, file);
  console.log(fileLocation);
  //res.send({image: fileLocation});
  res.sendFile(`${fileLocation}`);
});
router.post("/id", (req, res) => {
  console.log(req.params._id);
  User.findOne({ _id: req.body.id }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      console.log(user.profile_pic_name);
      res.send(user.profile_pic_name);
    } else {
      console.log("User not found - uploading");
      res.send("User not found");
    }
  });
});
module.exports = router;
