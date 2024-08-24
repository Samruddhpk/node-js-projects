const CustomAPIError = require("../errors/customError")
const { StatusCodes } = require("http-status-codes")

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong,please try again later...' })
}



module.exports = errorHandler