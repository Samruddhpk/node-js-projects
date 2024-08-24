const { CustomAPIError } = require("../errors/customAPIError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res
      .status(500)
      .json({ msg: "Something went wrong,please try again later..." });
  }
};

module.exports = errorHandler;
