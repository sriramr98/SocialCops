const User = require('./../models/user');
const {
  successResponse,
  failureResponse
} = require('./../utils/response');
const errorcodes = require('./../utils/errorcodes');
const jsonPatcher = require('fast-json-patch');
const imageUtils = require('./../utils/imageUtils');

const loginUserController = async (req, res) => {
  try {
    const user = req.body;
    // find if the user already exists
    const existingUser = await User.findOne({
      username: user.username
    });

    if (existingUser) {
      // user exists. generate token and login user
      // since we accept any password, I'm not really checking if passwords match
      const token = await existingUser.generateAuthToken();
      return res.status(200).json(successResponse(token));
    } else {
      const savedUser = await new User(user).save();
      const token = await savedUser.generateAuthToken();
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

const resizeImageController = async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    const imageName = req.body.imageName;
    const imageFormat = req.body.imageFormat;
    const imagePath = await imageUtils.downloadImage(imageUrl, imageName);
    if (imagePath) {
      imageUtils.resizeImage(imagePath, imageFormat, 50, 50).pipe(res);
    } else {
      return res.status(400).json("Error");
    }
  } catch (e) {
    // if anything goes wrong and we didn't anticipate
    return res.status(400).json("Error")
  }

};

module.exports = {
  loginUserController,
  jsonPatchController,
  resizeImageController
};