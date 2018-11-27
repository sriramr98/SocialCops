const User = require('./../models/user');
const {
  successResponse,
  failureResponse
} = require('./../utils/response');
const errorcodes = require('./../utils/errorcodes');
const jsonPatcher = require('fast-json-patch');

const loginUserController = async (req, res) => {
  try {
    const user = req.body;
    // find if the user already exists
    const existingUser = await User.findOne({
      username: user.username
    });

    if (existingUser) {
      // user exists. generate token and login user
      console.log('Existing user login');
      const token = await existingUser.generateAuthToken();
      console.log(`Token is ${token}`)
      return res.status(200).json(successResponse(token));
    } else {
      console.log('New user login');
      const savedUser = await new User(user).save();
      console.log(`Saved user ${savedUser}`);
      const token = await savedUser.generateAuthToken();
      console.log(`Token is ${token}`)
      return res.status(200).json(successResponse(token));
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json(failureResponse(errorcodes.ERROR_SERVER_ERROR, "Unable to login user"));
  }
};

const jsonPatchController = async (req, res) => {
  try {
    const jsonPatch = req.jsonPatch;
    const jsonData = req.jsonData;

    const modifiedJson = jsonPatcher.applyPatch(jsonData, jsonPatch).newDocument;
    return res.status(200).json(successResponse(modifiedJson));

  } catch (e) {
    console.log(e);
    return res.status(400).json(failureResponse(errorcodes.ERROR_SERVER_ERROR, "Error applying patch"));
  }
};

module.exports = {
  loginUserController,
  jsonPatchController
};