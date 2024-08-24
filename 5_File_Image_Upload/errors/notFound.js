const { StatusCodes } = require("http-status-codes")
const CustomAPIError = require("./customAPIError")


class NotFound extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}


module.exports = NotFound