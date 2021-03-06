const { failureResponse } = require('./../utils/response');
const errorcodes = require('./../utils/errorcodes');

const loginUserValidator = (req, res, next) => {
    const user = req.body;
    if (!user.username) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid username'
                )
            );
    }

    if (!user.password) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid password'
                )
            );
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
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid JSON data'
                )
            );
    }

    if (!jsonPatch) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid JSON Patch request'
                )
            );
    }

    req.jsonData = jsonData;
    req.jsonPatch = jsonPatch;
    next();
};

const imageResizeValidator = (req, res, next) => {
    const data = req.body;
    if (!data.imageUrl) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid image url'
                )
            );
    }
    if (!data.imageName) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid image name'
                )
            );
    }
    if (!data.imageFormat) {
        return res
            .status(400)
            .json(
                failureResponse(
                    errorcodes.ERROR_INVALID_BODY_PARAMETER,
                    'Invalid image format'
                )
            );
    }
    next();
};

module.exports = {
    loginUserValidator,
    jsonPatchValidator,
    imageResizeValidator
};
