const mongoose = require("mongoose");
const User = mongoose.model("User");
require("dotenv").config();

const getUser = async ({ username }) => {
    const user = await User.aggregate([
        {
            $match: { username: username },
        },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: 'user',
                as: 'allEvents',
            },
        },
    ])
    return user.length ? user[0] : {}
}

module.exports = {
    getUser
}