// We are using node's native package 'path'
// https://nodejs.org/api/path.html
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');


// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
};

// Webpack configuration
module.exports = {
  entry: [path.join(paths.SRC, 'index.js')],
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('style.bundle.css'),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: true
            }
          }
        ],
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[name]-[local]-[hash:base64:5]',
                minify: true,
                importLoaders: 2
              }
            },
            'postcss-loader',
            'less-loader'],
        }),
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:base64:5].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.(css|less)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:base64:5].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader',
        query: {
          classIdPrefix: '[name]-[hash:8]__'
        }
      },
      {
        test: /\.modernizrrc.js$/,
        loader: 'modernizr-loader'
      },
      {
        test: /\.modernizrrc(\.json)?$/,
        loader: 'modernizr-loader!json-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // directories named 'shared' will be resolved by lower modules, without ../../../.
    modules: ['node_modules', 'shared', path.resolve(__dirname, './src')],
    alias: {
      modernizr$: path.resolve(__dirname, './.modernizrrc')
    }
  }
};