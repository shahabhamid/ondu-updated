const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { ErrorMsg } = require("../../utils/errorHandler");

const SignIn = async ({ username, password }) => {
    if (!username || !password) {
        throw ErrorMsg("Please add all the fields", 500)
    } else {
        const savedUser = await User.findOne({ username: username })
        if (!savedUser) {
            throw ErrorMsg("Invalid Credentials", 401)
        } else {
            const matches = await bcrypt.compare(password, savedUser.password)

            if (matches) {
                const token = jwt.sign(
                    { _id: savedUser._id },
                    process.env.JWT_SECRET
                );
                let data = {
                    _id: savedUser._id,
                    username: savedUser.username,
                    name: savedUser.name,
                    email: savedUser.email,
                    deviceToken: savedUser.deviceToken,
                    profile_pic_name: savedUser.profile_pic_name,
                    bio: savedUser.bio,
                    links: savedUser.links,
                    followers: savedUser.followers,
                    following: savedUser.following,
                    allMessages: savedUser.allMessages,
                    allEvents: savedUser.allEvents,
                    accountEvents: savedUser.accountEvents,
                    accountEventsFrom: savedUser.accountEventsFrom,

                    passwordResetToken: savedUser.passwordResetToken,
                    passwordResetExpires: savedUser.passwordResetExpires,
                };
                return {
                    message: "Successfully Signed In",
                    token,
                    user: data,
                }
            } else {
                throw ErrorMsg("Invalid Credentials", 401)
            }
        }
    }
}

module.exports = {
    SignIn
}