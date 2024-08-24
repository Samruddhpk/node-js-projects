// register = create user
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { BadRequestError, UnAuthenticatedError } = require("../errors")




const register = async (req, res) => {

    // Create user in the database
    const user = await User.create({ ...req.body });
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};


const login = async (req, res) => {
    const { email, password } = req.body
    // compare password

    // basic validation
    if (!email || !password) {
        throw new BadRequestError('Please provide email & password')
    }
    const user = await User.findOne({ email })

    if (!user) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })


}


module.exports = {
    login, register
}