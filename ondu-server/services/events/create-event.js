const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const moment = require("moment");
require("dotenv").config();

const createEvent = async ({ userId, name, date, isPrivate, desc }) => {

    const dateString = new Date(date);
    const formattedDate = moment(dateString).format("dddd, MMMM DD, YYYY");
    const event = new Event({
        user: userId,
        desc: desc,
        name: name,
        date: formattedDate,
        isPrivate: isPrivate,
    });
    await event.save();
    console.log(event, 'event data added')
    return {
        data: event
    }
}

module.exports = {
    createEvent
}