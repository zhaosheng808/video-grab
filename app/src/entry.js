import 'babel-polyfill';
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueCookies from 'vue-cookies';
import settings from './includes/settings';
import Global from './includes/global';
import ElementUI from 'element-ui';
import filter from './includes/filter'; // 自定义管道
import moment from 'moment';
import './assets/scss/_variables.scss';

Vue.use(Router);
Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueCookies);
Vue.use(ElementUI);

moment.locale('zh-cn');
Vue.prototype.$moment = moment;

// **************************************************************

import bootstrap from './includes/bootstrap';
import Loading from './components/Loading';
import { createStore } from './store';
import { createRouter } from './router';
import App from './App.vue';

// import { createFetch } from './includes/fetch';

const loading = new Vue(Loading).$mount();
document.body.appendChild(loading.$el);

loading.start();
Vue.http.get(settings.rootPath + '/settings').then(({ data }) => {
  loading.finish();

  settings.siteName = data.siteName;
  settings.apiAddress = data.apiAddress;

  let store = createStore(settings.apiAddress);
  let router = createRouter(settings.rootPath + '/');

  // 挂载全局函数
  Vue.use(Global);

  // favicon
  let link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  // link.href = data.siteLogoUrl + '?s=3&w=32&h=32';
  link.href = settings.rootPath + '/static/favicon.ico';
  document.getElementsByTagName('head')[0].appendChild(link);

  // 初始化vue app
  bootstrap({
    app: App,
    store, // optional
    router,
    siteName: settings.siteName,
    startLoading() {
      loading.start();
    },
    stopLoading() {
      loading.finish();
    }
  });

}).catch((err) => {
  loading.finish();
  alert(err.message);
});