const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");



const register = async (req, res) => {
    // check duplicate email
    const { email, name, password } = req.body;

    const isEmailAlreadyExists = await User.findOne({ email });
    if (isEmailAlreadyExists) {
        throw new CustomError.BadRequestError('Email Already Exists');
    }

    // first registered user is admin
    const isFirstAccount = await User.countDocuments({}) === 0;

    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });


    // issue token - jwt
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('please provide email & password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser });

};

const logout = async (req, res) => {
    // removing cookie-token & setting another name
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000) // in 5 seconds - cookie disappears (my preference) - time is optional
    });

    // normally we dont send any - but for development purpose
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });

};

module.exports = {
    register, login, logout
};