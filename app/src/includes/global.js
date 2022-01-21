import axios from 'axios';
import settings from './settings';
import {getToken, setToken} from './common';
import { createFetch } from './fetch';

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 全局可调用的简单axios 未作全局token过期拦截
function gCallApi(method, path, data) {
  return new Promise((resolve, reject) => {

    const token = getToken();
    axios.request({
      url: path,
      method: method,
      baseURL: settings.apiAddress,
      headers: {
        'X-CSRF-Token': token,
        'Content-Type': 'application/json; format=camel',
        'Accept': 'application/json; format=camel, */*'
      },
      data: data
    }).then(({ data }) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}


exports.install = function (Vue, options) {
  // 时间戳转换日期格式化
  Vue.prototype.gFormatDate = (date, fmt) => {
    if (!date) return '';
    if (typeof (date) == 'number') date = new Date(date * 1000);

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }

    return fmt;
  };

  // 全局API拦截
  Vue.prototype.$axios = createFetch(settings.apiAddress);
  // 调用API
  Vue.prototype.gCallApi = gCallApi;
  // 注销
  Vue.prototype.gLogout = () => {
    return new Promise((resolve, reject) => {
      gCallApi('get', '/user/logout', {}).then((resp) => {
        resolve(resp);
      }).catch((error) => {
        reject(error);
      }).finally(() => {
        setToken()
      });
    });
  };
};