import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [ 
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/inicio/TelaInicio.vue'),
    meta: { requerAuth: false, somenteDeslogado: false }, //o meta é um objeto customizável para guardar informações sobre a rota. Aqui usamos para controlar acesso.
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
    meta: { requerAuth: false, somenteDeslogado: true }, //só pode acessar se NÃO estiver autenticado
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/cadastro/TelaCadastro.vue'),
    meta: { requerAuth: false, somenteDeslogado: true }, //só pode acessar se NÃO estiver autenticado
  },
  {
    path: '/esqueci-senha',
    name: 'EsqueciSenha',
    component: () => import('../views/esqueci-senha/EsqueciSenha.vue'),
    meta: { requerAuth: false, somenteDeslogado: true }, //só pode acessar se NÃO estiver autenticado
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //
  routes,
  scrollBehavior: () => ({ top: 0 }), //? sempre rola pro topo quando muda de rota
})

router.beforeEach((to, _from, next) => { //? guarda a lógica de autenticação aqui para não repetir em cada componente
  const auth = useAuthStore()

  const precisaDeAuth    = to.meta.requerAuth === true
  const somenteDeslogado = to.meta.somenteDeslogado === true

  if (precisaDeAuth && !auth.estaAutenticado) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (somenteDeslogado && auth.estaAutenticado) {
    return next({ name: 'Chat' })
  }

  next()
})

export default router