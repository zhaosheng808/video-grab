var path = require('path');
var isProduction = process.env.NODE_ENV === 'production';

// extract css from bundle into a file
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports.resolvePath = function (dir) {
  return path.resolve(__dirname, '..', dir);
};

module.exports.resolvePaths = function (dirs) {
  var paths = [];
  for (var i in dirs) {
    paths.push(path.resolve(__dirname, '..', dirs[i]));
  }
  return paths;
};

function generateCssLoader(options) {
  options = options || {};
  return {
    loader: 'css-loader',
    options: {
      minimize: isProduction,
      sourceMap: options.sourceMap,
    }
  };
}

function generateStyleLoaders(options, loader, loaderOptions) {
  var loaders = [
    'css-hot-loader',
    MiniCssExtractPlugin.loader + '?publicPath=' + options.publicPath,
    generateCssLoader(options)
  ];

  // append style loader
  if (loader) {
    loaders.push({
      loader: loader + '-loader',
      options: Object.assign({}, loaderOptions, { sourceMap: options.sourceMap })
    });
  }

  return loaders;
};

module.exports.styleLoadersMap = function (options) {
  return {
    css: generateStyleLoaders(options),
    scss: generateStyleLoaders(options, 'sass')
  };
};

module.exports.styleRules = function (options) {
  var map = module.exports.styleLoadersMap(options);
  var rules = [];
  for (var ext in map) {
    rules.push({
      test: new RegExp('\\.' + ext + '$'),
      use: map[ext]
    });
  }
  return rules;
};
