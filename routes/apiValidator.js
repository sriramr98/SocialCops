const {
  failureResponse
} = require('./../utils/response');
const errorcodes = require('./../utils/errorcodes');

const loginUserValidator = (req, res, next) => {
  const user = req.body;
  if (!user.username) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid username"));
    A
  }

  if (!user.password) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid password"));
  }
  if (user.authTokens) {
    delete user.authTokens;
  }
  next();
};

const jsonPatchValidator = (req, res, next) => {
  const jsonData = req.body.jsonData;
  const jsonPatch = req.body.jsonPatch;

  if (!jsonData) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid JSON data"));
  }

  if (!jsonPatch) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid JSON Patch request"));
  }

  req.jsonData = jsonData;
  req.jsonPatch = jsonPatch;
  next();
};

const imageResizeValidator = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) {
    return res.status(400).json(failureResponse(errorcodes.ERROR_INVALID_BODY_PARAMETER, "Invalid image url"));
  }
  next();
}

module.exports = {
  loginUserValidator,
  jsonPatchValidator,
  imageResizeValidator
};