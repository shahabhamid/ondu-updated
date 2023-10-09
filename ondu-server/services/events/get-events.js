const mongoose = require("mongoose");
const Event = mongoose.model("Event");
require("dotenv").config();

const getEvents = async () => {
    const events = await Event.find().populate('user', 'username name');;
    return events
}

module.exports = {
    getEvents
}