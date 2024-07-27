const path = require('path'); // Ensure this line is at the top
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: './', // Serve files relatively for production
    },
  });