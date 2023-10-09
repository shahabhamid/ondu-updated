const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ErrorMsg } = require("../../utils/errorHandler");

const SignUp = async ({ username, name, password }) => {

    const userData = await User.findOne({ username: username })
    if (userData) throw new ErrorMsg("Username Exists")
    const user = new User({
        username,
        name,
        password
    });
    const save = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return {
        message: "User Registered Successfully",
        token,
        user: save,
    }
}

module.exports = {
    SignUp
}