import { createRouter, createWebHistory } from 'vue-router';
import TelaInicio from '../views/TelaInicio.vue'; // <-- Importe aqui

const routes = [
  { path: '/', component: TelaInicio }, // <-- Use o componente importado aqui
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;