const express = require('express');
const apiController = require('./apiController');
const apiValidator = require('./apiValidator');
const router = express.Router();

router.post('/login', apiValidator.loginUserValidator, apiController.loginUserController);

module.exports = router;