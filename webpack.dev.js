const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Webpack configuration
module.exports = merge(common, {
  devtool: 'inline-source-map'
});