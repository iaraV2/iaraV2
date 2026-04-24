import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/telainicio/TelaInicio.vue') },
  { path: '/login', component: () => import('../views/login/login.vue') },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;