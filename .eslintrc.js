module.exports = {
  extends: "./node_modules/eslint-config-google/index.js",
  parserOptions: {
    ecmaVersion: 2017
  },

  env: {
    es6: true
  },
  rules: {
    "max-len": ["error", { code: 200 }]
  }
};
