const path = require('path'); // Ensure this line is at the top
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
    watchFiles: ['src/**/*', 'index.html'], // Watch files for changes
  },
});
