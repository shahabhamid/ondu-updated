const { changePassword } = require("./change-password")
const { changeUsername } = require("./change-username")
const { SignIn } = require("./sign-in")
const { SignUp } = require("./signup")
const { getUsers } = require("./get-users")
const { getUser } = require("./get-user-by-username")
const { followUser } = require("./follow-user")
const { unFollowUser } = require("./un-follow-user")

module.exports = {
    changePassword,
    SignIn,
    SignUp,
    changeUsername,
    getUsers,
    getUser,
    followUser,
    unFollowUser
}