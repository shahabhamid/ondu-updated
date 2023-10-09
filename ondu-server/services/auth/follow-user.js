const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

const followUser = async ({ followFrom, followTo }) => {
    console.log(followFrom, followTo)
    const user = await User.findOne({ username: followFrom })
    if (!user.following.includes(followTo)) {
        user.following.push(followTo);
        user.save();
    }
    const follower = await User.findOne({ username: followTo })
    if (!follower.followers.includes(followFrom)) {
        follower.followers.push(followFrom);
        follower.save();
    }
    return {
        message: "User Followed"
    }
}

module.exports = {
    followUser
}