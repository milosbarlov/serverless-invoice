const routes = [
  {
    path: '',
    component: () => import('layouts/ClientPortalLayout.vue'),
    children: [
      {
        name: 'confirmation',
        path: 'confirmation',
        component: () => import('pages/Confirmation.vue'),
        beforeEnter(to, from, next) {
          if (from.name === 'checkout') {
            next();
          } else {
            next('*');
          }
        },
      },
      {
        name: 'checkout',
        path: ':id',
        component: () => import('pages/Index.vue'),
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
