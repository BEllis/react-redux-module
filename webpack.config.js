const webpack = require('webpack');
const path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: SRC_DIR + '/index.js',
  devtool: "source-map",
  externals: {
    redux: "redux",
    "prop-types": "prop-types",
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  output: {
    path: BUILD_DIR,
    library: "react-redux-module",
    libraryTarget: "umd",
    filename: 'react-redux-module.min.js'
  },
  module: {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;
