if (process.env.NODE_ENV !== 'production') {
  throw new Error('this config show be compiled in production mode');
}
var merge = require('webpack-merge');
var Webpackbar = require('webpackbar');
var baseWebpackConfig = require('./webpack.base.config');
var utils = require('./webpack-utils');


// this plugin copies individual files or entire directories to the build directory.
var CopyWebpackPlugin = require('copy-webpack-plugin');
// this plugin will generate an HTML5 file for you that 
// includes all your webpack bundles in the body using script tags.
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // devtool: '#source-map',
  plugins: [
    // 添加 进度条
    new Webpackbar(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolvePath('./src/index.template.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.resolvePath('./static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]
});

