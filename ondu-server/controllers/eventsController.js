

const eventService = require("../services/events");
const { errorHandler } = require("../utils/errorHandler");

const createEvent = async (req, res, next) => {
    try {
        const response = await eventService.createEvent(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}

const getEvents = async (req, res, next) => {
    try {
        const response = await eventService.getEvents()
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const getEventById = async (req, res, next) => {
    try {
        const response = await eventService.getEventById(req.params)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}

module.exports = {
    createEvent, getEvents, getEventById
}
