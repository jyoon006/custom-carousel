const webpack = require('webpack');
const path = require('path');
const APP_DIR = path.resolve(__dirname, 'example');
const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'build');

const config = {
  entry: APP_DIR + '/example.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    port: 8080,
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  module : {
    loaders : [
      { test : /\.jsx?/, include : [ APP_DIR, SRC_DIR ], loader : 'babel-loader' },
      { test: /\.js$/, include : APP_DIR, loader : 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
      { test: /\.svg$/, loader: 'svg-inline-loader' }
    ]
  }
};

module.exports = config;