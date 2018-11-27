const {
  failureResponse
} = require('./../utils/response');
const errorcodes = require('./../utils/errorcodes');

const loginUserValidator = (req, res, next) => {
  const user = req.body;
  if (!user.username) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid username"));
  }

  if (!user.password) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid password"));
  }
  if (user.authTokens) {
    delete user.authTokens;
  }
  next();
};

module.exports = {
  loginUserValidator
};