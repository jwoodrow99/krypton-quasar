
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/analysis', component: () => import('pages/Analysis.vue') },
      { path: '/all_cryptos', component: () => import('pages/AllCryptos.vue') },
      { path: '/wallet', component: () => import('pages/Wallet.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
