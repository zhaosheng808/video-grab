import axios from 'axios';
import {Message} from "element-ui";
import {setToken} from './common';

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8;format=camel';
axios.defaults.headers['Accept'] = 'application/json;charset=UTF-8;format=camel'; // snake:蛇形 camel:驼峰

function toLogin() {
    Message.closeAll()
    Message.error('该用户没有权限或登录过期');
    setToken();
    window.location.href = window.location.protocol + '//' + window.location.host;
}

//  后台接口公共前缀
export function fetch(type, url, params, withToken, api) {
    return new Promise((resolve, reject) => {
        axios.defaults.baseURL = api;
        axios.defaults.withCredentials = false;
        var input = {
            method: type,
            url: url
        };
        if (typeof params != 'undefined' && params != null) {
            params = JSON.stringify(params);
            input.data = params;
        }
        if (withToken) {
            axios.defaults.headers.common['X-CSRF-Token'] = withToken;
        }
        axios(input)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error == '401') {
                        if (url.indexOf('/login') == -1) { // 登录页面不跳转
                            toLogin();
                            return;
                        }

                        // setTimeout(() => {
                            // window.location.href = '/';
                        // }, 1000);
                        reject(error.response.data.message);
                    } else {
                        reject(error.response.data.message);
                    }
                } else {
                    reject(error.message);
                }
            })
    })
}

export default {
    ajaxGet(url, params, withToken, api) {
        return fetch('get', url, params, withToken, api);
    },

    ajaxPost(url, params, withToken, api) {
        return fetch('post', url, params, withToken, api);
    },
    ajaxDelete(url, params, withToken, api) {
        return fetch('delete', url, params, withToken, api);
    },
    ajaxPut(url, params, withToken, api) {
        return fetch('put', url, params, withToken, api);
    }
}

