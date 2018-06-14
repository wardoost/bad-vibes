const webpack = require('webpack')
const { resolve, join } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const WebpackMd5Hash = require('webpack-md5-hash')

const root = resolve(__dirname)

module.exports = {
  entry: ['babel-polyfill', 'whatwg-fetch', './app/index.js'],
  output: {
    path: join(root, 'build/app'),
    publicPath: '/',
    filename:
      process.env.NODE_ENV === 'production' ? '[name].[hash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(root, 'app/index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      {
        from: 'static',
        to: './'
      }
    ]),
    new Dotenv({
      path: join(root, '.env'),
      safe: true
    })
  ].concat(
    process.env.NODE_ENV === 'production'
      ? [
          new CleanWebpackPlugin('./dist/*'),
          new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              screw_ie8: true,
              warnings: false,
              drop_console: true
            },
            mangle: {
              screw_ie8: true
            },
            output: {
              comments: false,
              screw_ie8: true
            }
          }),
          new WebpackMd5Hash()
        ]
      : [new webpack.NamedModulesPlugin()]
  ),
  devtool: 'source-map',
  devServer: {
    contentBase: join(root, 'dist'),
    compress: true,
    overlay: true,
    port: 3000,
    historyApiFallback: { index: '/index.html' }
  }
}
