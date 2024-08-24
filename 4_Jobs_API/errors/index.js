const CustomAPIError = require("./customAPIError")
const BadRequestError = require("./badRequest")
const UnAuthenticatedError = require("./unauthenticated")
const NotFoundError = require("./notFound")


module.exports = {
    CustomAPIError, BadRequestError, UnAuthenticatedError, NotFoundError
}