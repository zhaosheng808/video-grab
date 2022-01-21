import Vue from 'vue';
import Vuex from 'vuex';
import api from '../includes/api';
import {getToken, setToken} from '../includes/common';

export function createStore(apiAddress) {
  let token = getToken();
  var store = new Vuex.Store({
    state: {
      apiAddress: apiAddress,
      token: token,
      userId: '',
      sysadminFlag: false,
      username: '',
      projects: [],
      departments: [],
      services: [],
      isCollapse: false, // 左侧菜单是否折叠
    },
    getters: {
      isLogin: (state) => {
        return state.userId > 0;
      }
    },
    mutations: {
      DUMMY: () => {

      },
      SET_USER: (state, { token, userId, username, sysadminFlag }) => {
        state.token = token;
        state.userId = userId;
        state.username = username;
        state.sysadminFlag = sysadminFlag;
        setToken(token);
      },
      SET_PROJECTS: (state, { data }) => {
        state.projects = data;
      },
      SET_DEPARTMENTS: (state, { data }) => {
        state.departments = data;
      },
      SET_COLLAPSE: (state, data) => {
        state.isCollapse = data;
      },
      SET_SERVICE: (state, data) => {
        state.services = data;
      },

    },
    actions: {
      LOGIN: ({commit, state, rootState}, data) => {
        return new Promise((resolve, reject) => {
          api.ajaxPost(`/home/users/login`, data, null, state.apiAddress).then(res => {
            commit('SET_USER', {
              token: res.token,
              userId: res.user.id,
              username: res.user.username,
              userInfo: res.user,
              permissions: res.permissions,
              sysadminFlag: res.sysadminFlag,
            });
            setTimeout(() => {
              resolve(res);
            }, 500)
          }).catch((err) => {
            reject(err);
          })
        });
      },
      LOGOUT: ({ commit, state }) => {
        return new Promise((resolve, reject) => {
          const token = state.token;
          setToken();
          api.ajaxPost(`/home/users/logout`, {}, token, state.apiAddress).then(res => {
            commit('SET_USER', {
              token: '',
              userId: 0,
              username: '',
              userInfo: null,
              permissions: null,
              sysadminFlag: false,
            });
            setTimeout(() => {
              resolve(res);
            }, 500)
          }).catch((err) => {
            reject(err);
          })
        });
      },
      FETCH_USER_INFO: ({commit, state}) => {
        return new Promise((resolve, reject) => {
          const token = state.token;
          api.ajaxGet(`/home/users/current`, null, token, state.apiAddress).then(res => {
            commit('SET_USER', {
              token: token,
              userId: res.id,
              username: res.username,
              userInfo: res,
              permissions: res.permissions,
              sysadminFlag: res.sysadminFlag,
            });
            setTimeout(() => {
              resolve(res);
            }, 0)
          }).catch((err) => {
            reject(err);
          })
        });
      },
      FETCH_PROJECTS: ({commit, state}) => {
        return new Promise((resolve, reject) => {
          const token = state.token;
          api.ajaxGet(`projects`, null, token, state.apiAddress).then(res => {
            commit('SET_PROJECTS', {
              data: res
            });
            setTimeout(() => {
              resolve(res);
            }, 500)
          }).catch((err) => {
            reject(err);
          })
        });
      },
      FETCH_DEPARTMENTS: ({commit, state}) => {
        return new Promise((resolve, reject) => {
          const token = state.token;
          api.ajaxGet(`departments`, null, token, state.apiAddress).then(res => {
            commit('SET_DEPARTMENTS', {
              data: res
            });
            setTimeout(() => {
              resolve(res);
            }, 500)
          }).catch((err) => {
            reject(err);
          })
        });
      },
      FETCH_SERVICES: ({commit, state}) => {
        return new Promise((resolve, reject) => {
          const token = state.token;
          api.ajaxGet(`/home/services`, null, token, state.apiAddress).then(res => {
            // 全部转成小写
            const services = (res || []).map(item => {
              let formatItem = item;
              if (item && item.toLowerCase) {
                formatItem = item.toLowerCase()
              }
              return formatItem;
            })
            commit('SET_SERVICE', services);
            setTimeout(() => {
              resolve(services);
            }, 500)
          }).catch((err) => {
            reject(err);
          })
        });
      }
    }
  });
  return store;
};