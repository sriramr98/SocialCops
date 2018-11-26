const User = require('./../models/user');
const {
  successResponse,
  failureResponse
} = require('./../utils/response');

const loginUserController = async (req, res) => {
  const user = req.body;
  // find if the user already exists
  const existingUser = await User.findOne({
    username: user.username
  });

  if (existingUser) {
    // user exists. generate token and login userx
  } else {
    const savedUser = await new User(user).save();
    return res.status(200).json(successResponse(savedUser));
  }


};

module.exports = {
  loginUserController
};