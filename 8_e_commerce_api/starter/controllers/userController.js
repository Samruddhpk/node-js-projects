const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');


// for admin - admin can see all users
const getAllUsers = async (req, res) => {
    console.log(req.user);
    // gets users based on role=user by removing password in response
    // select= "-"password 
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
};


const getSingleUser = async (req, res) => {
    // this should only be for admin
    // if somebody who is user - is accessing - it should be errors
    // this is a e-commerce app - not social media app
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    // checking permissions
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

// just to check who is logged in 
const showCurrentUser = async (req, res) => {
    console.log(req.user);
    res.status(StatusCodes.OK).json({ user: req.user });
};
// update use - user.save()
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('please provide both values');
    }

    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};


// update user controller- findOneAndUpdate()
// const updateUser = async (req, res) => {
//     // giving permission user to update only for two values
//     const { name, email } = req.body;

//     if (!name || !email) {
//         throw new CustomError.BadRequestError('please provide name & email ');
//     }

//     const user = await User.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true });
//     // create token 
//     const tokenUser = createTokenUser(user);
//     // send response coming from here, and user
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });

// };


const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};


module.exports = {
    getAllUsers, getSingleUser, updateUser, updateUserPassword, showCurrentUser
};