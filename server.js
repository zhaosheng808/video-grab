if (process.env.pm_exec_path) process.env.NODE_ENV = 'production';

let fs = require('fs');
let path = require('path');
let express = require('express');

let server;

// handle uncaught exception
process.on('uncaughtException', (err) => {
  // record erro log
  console.error(err);
  if (server) {
    // forcely quit process if server is not closed in 5 seconds.
    let killTimer = setTimeout(() => {
      process.exit(1);
    }, 5000);
    killTimer.unref;
    // close server
    server.close();
  }
  // quit process
  process.exit(1);
});

// handle sigint signal
process.on('SIGINT', () => {
  console.log('user requests to stop server \n gracefully shutting down from  SIGINT (Crtl-C)');
  // forcely quit process if server is not closed in 5 seconds.
  let killTimer = setTimeout(() => {
    process.exit(1);
  }, 5000);
  killTimer.unref;
  // close server
  if (server) {
    server.close();
  }
  // quit process
  process.exit(1);
});

const config = require('./config');
const debug = require('debug')(config.appName);
const argv = require('minimist')(process.argv.slice(2));

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

// 获取版本信息
app.get('/version', express.static('./'));

config.init().then(function () {
  // app.use('/share', require('./share/app'));

  Object.keys(config.components).forEach((key) => {
    if (argv['component'] && argv['component'] !== key) return;

    let appFile = path.join(__dirname, './' + key + '/app.js');
    if (fs.existsSync(appFile)) {
      app.use(
        config.components[key].mountpath + '/',
        require('./' + key + '/app'));
    } else {
      console.warn('文件不存在: ' + appFile);
    }
  });

  app.use('/', function (req, res, next) {
    if (req.url === '/') {
      res.redirect('/admin');
    } else {
      next();
    }
  });

  server = app.listen(process.env.PORT || config.port, () => {
    debug('Express server listening on port ' + server.address().port);
  });
}).catch((error) => {
  console.log('get coord error: ', error);
  process.exit(1);
});
