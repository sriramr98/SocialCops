const express = require('express');
const apiController = require('./apiController');
const apiValidator = require('./apiValidator');
const router = express.Router();
const authenticateUserToken = require('./../utils/authenticate');

router.post('/login', apiValidator.loginUserValidator, apiController.loginUserController);

router.post('/patch', authenticateUserToken, apiValidator.jsonPatchValidator, apiController.jsonPatchController);

router.post('/resize', authenticateUserToken, apiValidator.imageResizeValidator, apiController.resizeImageController);

module.exports = router;
