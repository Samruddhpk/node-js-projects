const jwt = require("jsonwebtoken")
const { Unauthenticated, BadRequest } = require("../errors")


// TODO: Refer Dashboard Controller

const authenticationMiddleware = (req, res, next) => {
    // console.log(req)
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new BadRequest('No token provided', 400)
    }

    // authHeader is string , split it to array and get the first value in that
    // 0-Bearer 1-<token>

    const token = authHeader.split(' ')[1]
    // console.log(token)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // destructure
        const { id, username } = decoded
        // create new property on req object with "user" and store destructured data
        req.user = { id, username }

        // pass it to next middleware
        next()
    } catch (error) {
        throw new Unauthenticated('Not authorized to access this route', 401)
    }
}


module.exports = authenticationMiddleware