var express = require('express');
var path = require('path');
var os = require('os');
var globalConfig = require('../../config');

var serverPort = globalConfig.port; // 本地开发的端口号

var serverIP = getIPAddress();

// *production mode:
// server function is provided by express.
// client content is served by pre-compiled dist directory.
// *development mode:
// server function is provided by express.
// client content is served by webpack devmiddleware(by setup-dev-server).

// 获取内网ip
function getIPAddress() {
  let IPAddress = '';
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        IPAddress = alias.address;
        break;
      }
    }
    if (IPAddress) {
      break;
    }
  }
  return IPAddress;
};
module.exports = function setupServer(app, mountpath) {
  var resolve;
  var promise = new Promise(r => {
    resolve = r;
  });

  if (!mountpath) mountpath = '/';

  if (process.env.DEV_SERVER) {
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.dev.config');

    // add 'webpack-hot-middleware/client' into the entry array.
    // this connects to the server to receive notifications
    // when the bundle rebuilds and then updates your client bundle accordingly.
    var hmrName = '/__webpack_hmr';
    if (mountpath != '/') {
      hmrName = mountpath + hmrName;
    }
    Object.keys(webpackConfig.entry).forEach(function (name) {
      webpackConfig.entry[name] = ['webpack-hot-middleware/client?path=' + hmrName + '&reload=true']
        .concat(webpackConfig.entry[name]);
    });

    // compiler will not runs until a callback function is provided
    var compiler = webpack(webpackConfig);

    // serves the files emitted from webpack over a connect server
    // if files changed in watch mode, the middleware no longer serves the old bundle,
    // but delays requests until the compiling has finished.
    var devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: '/',
      stats: 'errors-only', // https://webpack.docschina.org/configuration/stats/#src/components/Sidebar/Sidebar.jsx
      quiet: true //turn off errors to work with friendly-errors-webpack-plugin
    });

    // connect a browser client to a webpack server & receive updates.
    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
      log: () => {}, //turn off logs to work with friendly-errors-webpack-plugin
      heartbeat: 2000
    });

    // html-webpack-plugin will generate an HTML5 file for you that
    // includes all your webpack bundles in the body using script tags.
    // each one of these plugin calls binds a callback to fire at specific steps throughout the build process
    // force page reload when html-webpack-plugin template changes
    compiler.hooks.compilation.tap('ReloadAfterHtmlEmit', function (compilation) {
      //the compiler is starting a new compilation...
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('ReloadAfterHtmlEmit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb(null, data);
      });
    });

    // serve webpack bundle output
    app.use(devMiddleware);

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware);

    // serve pure static assets
    // these assets are linked by <a>, etc.(not by img, video, audio)
    // they will be copied in production mode.
    app.use('/static', express.static(path.join(__dirname, '../static')));

    // if the bundle is valid or after it is valid again
    devMiddleware.waitUntilValid(function () {
      if (resolve) {
        var localAddress = 'http://localhost:' + serverPort + mountpath;
        var networkAddress = 'http://' + serverIP + ':' + serverPort + mountpath;
        console.log('  dev server started. App running at:\n' +
          '  - Local: ' + localAddress + '\n' +
          '  - Network: ' + networkAddress + '\n ' +
          '  Note that the development build is not optimized.\n' +
          '  To create a production build, run npm run build.\n');
        resolve();
        resolve = undefined;
      }
    });
  } else {
    //./dist is the generated directory
    app.use('/', express.static(path.join(__dirname, '../dist'), { maxAge: 10800000 }));
  }

  return promise;
};
