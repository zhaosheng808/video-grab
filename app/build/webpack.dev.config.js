if (process.env.NODE_ENV === 'production') {
  throw new Error('this config show be compiled in development mode');
}

var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.config');
var utils = require('./webpack-utils');

// this plugin copies individual files or entire directories to the build directory.
var CopyWebpackPlugin = require('copy-webpack-plugin');
// this plugin will generate an HTML5 file for you that 
// includes all your webpack bundles in the body using script tags.
var HtmlWebpackPlugin = require('html-webpack-plugin');

// this plugin recognizes certain classes of webpack errors and cleans,
// aggregates and prioritizes them to provide a better Developer Experience
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');


var config = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new FriendlyErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolvePath('./src/index.template.html'),
      inject: true
    })
  ]
});

// copy custom static assets when in development mode but without dev-server running
if (!process.env.DEV_SERVER) {
  config.plugins.push(
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.resolvePath('./static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  );
} else {
  config.plugins.push(
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;