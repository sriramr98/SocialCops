'use strict';
const User = require('./../models/user');
const {failureResponse} = require('./../utils/response');
const errorCodes = require('./../utils/errorcodes');

const authenticateUserToken = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization');
        if (!authToken) {
            return res
                .status(404)
                .json(failureResponse(errorCodes.ERROR_INVALID_TOKEN, 'Invalid token'));
        }
        const userWithToken = await User.findByToken(authToken);
        if (!userWithToken) {
            return res
                .status(404)
                .json(
                    failureResponse(
                        errorCodes.ERROR_INVALID_RESOURCE,
                        'Unable to find user.'
                    )
                );
        }

        req.user = userWithToken;
        next();
    } catch (e) {
        // error with token format
        return res
            .status(400)
            .json(
                failureResponse(errorCodes.ERROR_INVALID_TOKEN, 'Invalid token format')
            );
    }
};

module.exports = authenticateUserToken;
