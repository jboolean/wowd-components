const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


// Webpack configuration
module.exports = merge(common, {
  entry: ['react-hot-loader/patch'],
  devtool: 'inline-source-map',
  devServer: {
    // without this the .html extension is required
    historyApiFallback: {
      rewrites: [
        { from: /^\/shows/, to: '/shows.html' },
        { from: /^\/schedule/, to: '/schedule.html' }
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(path.resolve(__dirname, 'src'), 'shows.html'),
      filename: 'shows.html'
    }),
    new HtmlWebpackPlugin({
      template: path.join(path.resolve(__dirname, 'src'), 'schedule.html'),
      filename: 'schedule.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true
    })
  ]
});