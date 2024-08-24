const { StatusCodes } = require("http-status-codes")
// const { CustomAPIError } = require("../errors")

const errorHandler = (err, req, res, next) => {

    // setting defaults
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong,please try again later..'
    }
    // commented coz,added customError object above - no use below
    // if (err instanceof CustomAPIError) {
    //     return res.status(err.statusCode).json({ msg: err.message })
    // }
    // *** Validation error ***
    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',')
        customError.statusCode = 400
    }

    // ***duplicate email***
    // code & other values present in mongoose error object - we just simplified & made to show only user friendly error
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field ,please chose another value`
        customError.statusCode = 400
    }

    // *** Cast Error ***
    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })

}

module.exports = errorHandler