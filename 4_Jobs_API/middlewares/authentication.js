const User = require("../models/User")
const { BadRequestError, UnAuthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")



const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach user to job routes
        req.user = { userId: payload.userId, name: payload.name }
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid')
    }
}

module.exports = auth