const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

require("dotenv").config();
const { ErrorMsg } = require("../../utils/errorHandler");

const changePassword = async ({ oldPassword, newPassword, username }) => {
    if (!oldPassword || !newPassword || !username) {
        throw ErrorMsg("Please add all the fields", 422);
    } else {
        const savedUser = await User.findOne({ username: username })
        if (savedUser) {
            const matches = await bcrypt.compare(oldPassword, savedUser.password)
            if (matches) {
                savedUser.password = newPassword;
                await savedUser.save()
                return { message: "Password Changed Successfully" }
            } else {
                throw ErrorMsg("Invalid Credentials", 401);
            }
        } else {
            throw ErrorMsg("Invalid Credentials", 401);
        }
    }
}
module.exports = {
    changePassword
}