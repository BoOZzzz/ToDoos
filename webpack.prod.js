const path = require('path'); // Ensure this line is at the top
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // Source maps for debugging
  optimization: {
    minimize: true, // Minimize for production
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.[contenthash].js', // Filename pattern for caching
    publicPath: './', // Public path for relative paths
  },
});
