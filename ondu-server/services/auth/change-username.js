const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();
const { ErrorMsg } = require("../../utils/errorHandler");

const changeUsername = async ({ newUsername, username }) => {
    if (!newUsername || !username) {
        throw ErrorMsg("Please add all the fields", 422);
    } else {
        const alreadyExist = await User.findOne({ username: newUsername })
        if (!alreadyExist) {
            const savedUser = await User.findOne({ username: username })
            savedUser.username = newUsername;
            await savedUser.save()
            return { message: "Username Changed Successfully" }
        } else {
            throw ErrorMsg("Username Already Exists");
        }
    }
}

module.exports = {
    changeUsername
}