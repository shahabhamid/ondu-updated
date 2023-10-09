const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

const getUsers = async ({ username }) => {
    const query = username ? { username: { $regex: username, $options: "i" } } : {};
    const users = await User.find(query, {
        _id: 1,
        name: 1,
        username: 1,
        profile_pic_name: 1,
    })
    return users
}

module.exports = {
    getUsers
}