import Router from 'vue-router';

// route-level code splitting(webpack 2.0)

export function createRouter(basePath) {
  return new Router({
    base: basePath,
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    }, // scroll to page top when changing router.
    routes: [
      { path: '/login', component: () => import('../views/Login.vue'), meta: { anonymous: true } },
      { path: '/logout', component: () => import('../views/Logout.vue'), meta: { anonymous: true } },
      { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { anonymous: true } },
      {
        path: '/',
        component: () => import('../views/Index.vue'),
        redirect: '/dashboard',
        children: [
          { path: 'home',
            component: () => import('../views/home/Index.vue'),
            redirect: '/home/application',
            children: [
              { path: 'user', component: () => import('../views/home/User.vue') },
              { path: 'application', component: () => import('../views/home/Application.vue') },
              { path: 'service', component: () => import('../views/home/Service.vue') },
            ]
          },
        ]
      },
      { path: '/403', component: () => import('../views/Forbidden.vue'), meta: { anonymous: true }},
      { path: '/404', component: () => import('../views/NotFound.vue'), meta: { anonymous: true }},
      { path: '*', redirect: '/404' }
    ]
  });
}
