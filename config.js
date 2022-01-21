var packageJson = require('./package.json');

var config = {
  appName: packageJson.name,
  siteName: '视频地址解析服务平台',
  port: 18000,
  apiAddress: '/api', // api接口地址
  components: {
    app: { mountpath: '' },
  }
};

const co = require('co');

config.init = co.wrap(function* () {
  return yield Promise.resolve();
});

module.exports = config;
