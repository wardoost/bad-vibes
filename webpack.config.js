const webpack = require('webpack')
const { resolve, join } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const WebpackMd5Hash = require('webpack-md5-hash')

const root = resolve(__dirname)

module.exports = (env, argv) => ({
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
      template: join(root, 'app/index.html'),
      inject: false
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
    argv.mode === 'production'
      ? [
          new CleanWebpackPlugin('./build/app/*'),
          new webpack.HashedModuleIdsPlugin(),
          new WebpackMd5Hash()
        ]
      : []
  ),
  devtool: argv.mode === 'development' ? 'source-map' : false,
  devServer: {
    contentBase: join(root, 'dist'),
    compress: true,
    overlay: true,
    port: 3000,
    historyApiFallback: { index: '/index.html' }
  }
})
