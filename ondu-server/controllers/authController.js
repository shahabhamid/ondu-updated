

const authService = require("../services/auth");
const { errorHandler } = require("../utils/errorHandler");

const signIn = async (req, res, next) => {
    try {
        const response = await authService.SignIn(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}

const signUp = async (req, res, next) => {
    try {
        const response = await authService.SignUp(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}

const changePassword = async (req, res, next) => {
    try {
        const response = await authService.changePassword(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const changeUsername = async (req, res, next) => {
    try {
        const response = await authService.changeUsername(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const getUsers = async (req, res, next) => {
    try {
        const response = await authService.getUsers(req.query)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const getUser = async (req, res, next) => {
    try {
        const response = await authService.getUser(req.query)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const followUser = async (req, res, next) => {
    try {
        const response = await authService.followUser(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
const unFollowUser = async (req, res, next) => {
    try {
        const response = await authService.unFollowUser(req.body)
        res.json(response)
    } catch (error) {
        next(errorHandler(error, req, res));
    }
}
module.exports = {
    signIn,
    signUp,
    changePassword,
    changeUsername,
    getUsers,
    getUser,
    followUser,
    unFollowUser
}
