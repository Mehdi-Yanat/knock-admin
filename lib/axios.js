const { default: axios } = require("axios");

const instance = axios.create({
    baseURL: 'http://localhost:4500',
    timeout: 1000,
  });

module.exports = instance