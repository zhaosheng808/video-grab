var webpack = require('webpack');
var utils = require('./webpack-utils');
var config = require('../app.config');

// this plugin use uglifyjs to minify javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// this plugin optimize/minimize css assets
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// extract css from bundle into a file
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

let rootPath = config.mountPath;
if (rootPath.substr(-1) == '/') {
  rootPath = rootPath.substr(0, rootPath.length - 1);
}
let chunkhash = (process.env.DEV_SERVER ? '' : '.[chunkhash:6]');

module.exports = {
  context: utils.resolvePath(''),
  entry: {
    app: utils.resolvePath('src/entry.js'),
  },
  output: {
    path: utils.resolvePath('dist'), // output path
    publicPath: rootPath + '/',
    filename: `assets/js/[name]${chunkhash}.js`,
    chunkFilename: `assets/js/[id]${chunkhash}.js`
  },
  resolve: {
    // an array of extensions that should be used to resolve modules.
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolvePath('src'),
      '@share': utils.resolvePath('../share/')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // loaders specifies Webpack loaders to overwrite the default loaders
          // used for language blocks inside *.vue files.
          loaders: utils.styleLoadersMap({
            sourceMap: true,
            publicPath: '../../'
          }),
          // During template compilation, the compiler can transform certain attributes,
          // such as src URLs, into require calls, so that the target asset can be handled by Webpack.
          transformToRequire: {
            video: 'src',
            audio: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [/\.esm\.js$/, utils.resolvePath('src'), utils.resolvePath('../share/src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'assets/images/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[hash:6].[ext]'
        }
      }
    ].concat(utils.styleRules({
      sourceMap: true,
      publicPath: '../../'
    }))
  },
  plugins: [
    // The DefinePlugin allows you to create global constants which will be replaced at compile time
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__ROOT__': JSON.stringify(rootPath)
    }),
    new VueLoaderPlugin(),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: `assets/css/[name]${chunkhash}.css`,
      chunkFilename: `assets/css/[id]${chunkhash}.css`
    })
  ],
  optimization: {
    minimizer: [
      // minify with dead-code elimination
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      //minify css assets
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')({
          reduceIdents: false,// https://github.com/ben-eb/cssnano/issues/247
        }),
        cssProcessorOptions: {discardComments: {removeAll: true}},
        canPrint: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: false,
        default: false,
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: (module) => {
            if (!module.resource) return false;
            return (/[\\/]node_modules[\\/]/.test(module.resource) ||
              module.resource.indexOf(utils.resolvePath('./libs')) === 0);
          },
          enforce: true
        }
      }
    }
  }
}

