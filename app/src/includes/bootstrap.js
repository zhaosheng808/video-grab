import Vue from 'vue';
// import { sync } from 'vuex-router-sync';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';  // Progress 进度条样式
import {getToken} from './common';

export default function bootstrap(options) {
  let app = options.app;
  let store = options.store;
  let router = options.router;

  // ==================full navigation resolution flow===========================
  // Call leave guards in deactivated components
  // Call global beforeEach guards
  // Call beforeRouteUpdate guards in reused components (2.2+)
  // Call beforeEnter in route configs
  // Resolve async route components
  // Call beforeRouteEnter in activated components
  // Call global beforeResolve guards
  // Navigation confirmed.
  // Call global afterEach hooks.
  // DOM updates triggered.
  // Call callbacks passed to next in beforeRouteEnter guards with instantiated instances.

  // the asyncData function should also be called when a route component is reused
  // register a global mixin that calls `asyncData` when a route component's params change
  Vue.mixin({
    // in-componet router guards
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params /foo/:id, when we
    // navigate between /foo/1 and /foo/2, the same Foo component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    beforeRouteUpdate(to, from, next) {
      next();
    }
  });

  // sync the router with the vuex store.
  // this registers `store.state.route`
  // It adds a route module into the store, which contains the state representing the current route.
  // When the router navigates to a new route, the store's state is updated.
  // sync(store, router);
  // !!!bug when refreshing page: store changes will be detected when dynamic register state module. that will
  // cause router be updated. but at the momemt router has not be changed to new one.

  function diffRouteComponents(to, from) {
    // find the route index from which the difference begins.
    let diffIndex = -1; // from which index the routes are different (including params change)
    let newDiffIndex = -1; // from which index the route path are different (excluding params change)
    for (let i = 0; i < to.matched.length; ++i) {
      // check if routes are different
      if (to.matched[i] !== from.matched[i]) {
        if (diffIndex < 0) diffIndex = i;
        newDiffIndex = i;
        break;
      }
      // check if params of routes are different
      if (/:[^/]+/.test(to.matched[i].path) &&
        Object.keys(to.params).some((key) =>
          to.matched[i].path.indexOf(':' + key) >= 0 &&
          to.params[key] != from.params[key])) {
        diffIndex = i;
        continue;
      }
    }

    // find different components
    let activated = [];
    let prevActivated = [];
    let newActivated = [];
    let newPrevActivated = [];
    if (diffIndex >= 0) {
      to.matched.slice(diffIndex).forEach((r, index) => {
        let components = Object.keys(r.components).map((key) => r.components[key]);
        activated = activated.concat(components);
        if (newDiffIndex >= 0 && index + diffIndex >= newDiffIndex) {
          newActivated = newActivated.concat(components);
        }
      });
      from.matched.slice(diffIndex).forEach((r, index) => {
        let components = Object.keys(r.components).map((key) => r.components[key]);
        prevActivated = prevActivated.concat(components);
        if (newDiffIndex >= 0 && index + diffIndex >= newDiffIndex) {
          newPrevActivated = newPrevActivated.concat(components);
        }
      });
    }

    return {
      activated, // components that 'to' route needs recreated or refreshed
      prevActivated, // components that 'from' route needs recreated or refreshed
      newActivated, // components that 'to' route needed recreated
      newPrevActivated // components that 'from' route needed recreated
    };
  }

  // Add router hook for handling asyncData.
  // resolve guards will be called right before the navigation is confirmed,
  // after all in-component guards and async route components are resolved.
  // have no access to this.
  router.beforeResolve((to, from, next) => {
    let diff = diffRouteComponents(to, from);

    if (store) {
      // register new store modules
      diff.newActivated.filter((component) => component.storeModules).forEach((component) => {
        for (let key in component.storeModules) {
          let paths = key.split('/');
          store.registerModule(paths, component.storeModules[key]);
        }
      });
    }

    // get async data for new route
    const asyncDataComponents = diff.activated.filter((component) => component.asyncData);
    if (!asyncDataComponents.length) {
      next();
    } else {
      if (options.startLoading) options.startLoading();
      Promise.all(asyncDataComponents.map((component) => {
        let data = {
          route: to,
          updated: diff.newActivated.indexOf(component) < 0
        };
        if (store) data.store = store;
        return component.asyncData(data);
      })).then(() => {
        if (options.stopLoading) options.stopLoading();
        next();
      }).catch(next);
    }
  });

  // 是否需要匿名登录
  router.beforeEach((to, from, next) => {
    NProgress.start(); // 开启Progress
    const token = getToken();
    if (token) { // 判断是否有token
      if (to.path === '/login') {
        // console.log('登陆后进去登陆页面');
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      // 判断是否是匿名登陆页面
      if (to.meta.anonymous) {
        next();
      }else {
        next('/login'); // 否则全部重定向到登录页
      }
    }
    NProgress.done();
  });

  router.afterEach((to, from) => {
    let diff = diffRouteComponents(to, from);

    // update title callback
    document.title = options.siteName;
    diff.activated.forEach((component) => {
      let titleText;
      const { title } = component;
      if (title) {
        titleText = typeof title === 'function' ? title() : title;
      }
      if (titleText) {
        document.title = titleText + ' - ' + options.siteName;
      }
    });

    if (store) {
      // unregister previous store modules
      diff.newPrevActivated.filter((component) => component.storeModules).forEach((component) => {
        for (let key in component.storeModules) {
          let paths = key.split('/');
          store.unregisterModule(paths);
        }
      });
    }

    NProgress.done(); // 结束Progress
  });

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  // Vuex/Router provides a mechanism to "inject" the store into all child components
  // from the root component with the store option (enabled by Vue.use(Vuex/Router)):
  let vueOptions = {
    router,
    render: (h) => h(app)
  };
  if (store) vueOptions.store = store;
  const vueInstance = new Vue(vueOptions);

  // when the router has completed the initial navigation
  // which means it has resolved all async enter hooks, async components.
  // onReady is called after beforeResolve.
  router.onReady(() => {
    // actually mount to DOM
    vueInstance.$mount('#app');
  });
};
