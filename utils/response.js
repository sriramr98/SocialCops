// This module has util functions to standardize response schema
const successResponse = (data) => {
  return {
    success: true,
    data,
    error: null
  };
};

const failureResponse = (errorCode, error) => {
  return {
    success: false,
    data: null,
    error: {
      errorCode,
      error
    }
  };
};

module.exports = {
  successResponse,
  failureResponse
};