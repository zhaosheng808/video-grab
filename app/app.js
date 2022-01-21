const express = require('express');
const logger = require('morgan');
const config = require('./app.config');
const globalConfig = require('../config');
const co = require('co');
const bodyParser = require('body-parser');

const isProduction = process.env.NODE_ENV === 'production';

let app = express();

// 自定义跨域中间件
let allowCors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X-CSRF-Token");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCors);// 使用跨域中间件
// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

if (!isProduction) {
  // setup http request logger
  app.use(logger('dev'));
}

app.get('/settings', (req, res, next) => {
  co(function* () {
    let apiAddress = globalConfig.apiAddress;
    if (isProduction) {
      apiAddress = '/api';
    }
    res.json({
      siteName: config.siteName,
      apiAddress: apiAddress
    });
  }).catch((error) => {
    res.status(500).send(error);
  });
});
// url routing
app.use('/api/analysis', require('./api/analysis'));

// 配置错误处理中间件 需要放置在最后面
app.use(function (err, req, res, next) {
  let errMsg = err;
  if (err && err.message) {
    errMsg = err.message;
  }
  res.status(500).json({
    code: 500,
    message: errMsg,
  });
});

// handle fallback for HTML5 history API
// put forward to dispatch requests.
app.use(require('connect-history-api-fallback')({
  rewrites: [
    { from: /__webpack_hmr$/, to: (context) => context.request.path }
  ]
}));

// middleware setup for static assets
require('./build/setup-server')(app, config.mountPath);

module.exports = app;