import axios from 'axios';
import {Message} from 'element-ui';
import {getToken, setToken} from './common';

export function createFetch(apiAddress) {
    // axios 配置
    let instance = axios.create({
        baseURL: apiAddress,
        timeout: 1000 * 60 * 5, // 超时5分钟
        headers: {
            'Content-Type': 'application/json;charset=UTF-8;format=camel',
            'Accept': 'application/json;charset=UTF-8;format=camel' // 返回数据驼峰 snake:蛇形 camel:驼峰
        }
    });
    // http request 拦截器
    instance.interceptors.request.use(
        (config) => {
            // 每次请求都需要判断是否有token
            let token = getToken();
            if (token) {
                config.headers['X-CSRF-Token'] = token;       // 让每个请求携带token-- ['X-CSRF-Token']为自定义key
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        });

    // http response 拦截器
    instance.interceptors.response.use(
        (response) => {
            if (response.data && response.data.code === 4001) { // 权限
                toForbidden();
            }
            return response.data || {};
        },
        (err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 500:
                        if (err.response.data.error === 401) {
                            // 没权限和token过期都是401
                            if (err.response.data.message == 'Token无效') {
                                // 跳转首页
                                toLogin();
                                return;
                            }
                        }
                        break;
                    case 401:
                        toLogin();
                        // 跳转首页
                        break;
                    default:
                }
                if (err.response.data) {
                    return Promise.reject(err.response.data);
                }
            }
            if (err.response && err.response.data) {
                return Promise.reject(err.response.data);
            } else {
                if (typeof err === 'object') {
                    return Promise.reject(err.toString());
                } else {
                    return Promise.reject(err);
                }
            }
        }
    );

    return instance;
}

function toLogin() {
    Message.closeAll()
    Message.error('该用户没有权限或登录过期');
    setToken();
    window.location.href = window.location.protocol + '//' + window.location.host;
}

function toForbidden() {
    window.location.href = window.location.protocol + '//' + window.location.host + '/403';
}
