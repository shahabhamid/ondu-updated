const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: String,
  },
  // deviceToken: {
  //   type: String,
  //   required: true,
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  password: {
    type: String,
    required: true,
  },

  profile_pic_name: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  links: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  allMessages: {
    type: Array,
    default: [],
  },
  // allEvents: {
  //   type: Array,
  //   default: [],
  // },
  accountEvents: {
    type: Array,
    default: [],
  },
  accountEventsFrom: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  console.log("Just before saving before hashing  ", user.password);
  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 8);
  console.log("Just before saving & after hashing", user.password);
  next();
});

mongoose.model("User", userSchema);
