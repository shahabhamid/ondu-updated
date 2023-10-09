const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

const unFollowUser = async ({ followFrom, followTo }) => {
    const user = await User.findOne({ username: followFrom })
    if (user.following.includes(followTo)) {
        let index = user.following.indexOf(followTo);
        user.following.splice(index, 1);
        user.save();
    }
    const follower = await User.findOne({ username: followTo })
    if (follower.followers.includes(followFrom)) {
        let index = follower.followers.indexOf(followFrom);
        follower.followers.splice(index, 1);
        follower.save();
    }
    return {
        message: "User unFollowed"
    }
}

module.exports = {
    unFollowUser
}