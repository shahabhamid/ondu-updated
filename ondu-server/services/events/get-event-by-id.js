const mongoose = require("mongoose");
const Event = mongoose.model("Event");
require("dotenv").config();

const getEventById = async ({ id }) => {
    const event = await Event.findById(id).populate('user', 'username name');
    return event
}

module.exports = {
    getEventById
}