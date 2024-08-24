const CustomAPIError = require("./customAPIError")
const BadRequestError = require("./badRequest")
const NotFoundError = require("./notFound")
const UnauthenticatedError = require("./unAuthenticated")

module.exports = {
    CustomAPIError, BadRequestError, NotFoundError, UnauthenticatedError
}