const jwt = require("jsonwebtoken")
const { BadRequest } = require("../errors")
const { StatusCodes } = require("http-status-codes")

const login = async (req, res) => {

    const { username, password } = req.body
    // mongoose validation
    // joi
    //check in controller
    if (!username && !password) {
        throw new BadRequest('Please provide username & password', 400)
    }

    // just for demo , created by db
    const id = new Date().getDate()

    // try to keep payload small,better experience for users
    //  just for demo, in production use long, complex and unguessable string value !!!
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.status(StatusCodes.OK).json({ msg: "User Created", token })
}



const dashBoard = async (req, res) => {
    // console.log(req)
    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(StatusCodes.OK).json({ msg: `Hello, ${req.user.username}`, secret: `Here is your authorized data, your lucky number is : ${luckyNumber}` })

}

module.exports = {
    login, dashBoard
}