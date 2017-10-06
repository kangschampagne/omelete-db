var webpack = require('webpack')
var path = require('path')
var pkg = require(path.resolve(process.cwd(), './package.json'))
var version = pkg.version

var webpackConfig = {
  entry: {
    index: './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'dist'),
    library: `pkg/${pkg.name}/${version}/index`,
    libraryTarget: 'amd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // warnings:false
        properties: false,
        drop_console: true,
      },
      output: {
        ascii_only: true
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
}

module.exports = webpackConfig