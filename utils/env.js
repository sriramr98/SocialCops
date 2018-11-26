// this module reads all Environmental Variables and sets a default value for testing
module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/feedstack",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "somesecretkeythatyouwillneverfigureout"
};