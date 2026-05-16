import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [ 
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/inicio/TelaInicio.vue'),
    meta: { requerAuth: false, somenteDeslogado: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
    meta: { requerAuth: false, somenteDeslogado: true },
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/cadastro/TelaCadastro.vue'),
    meta: { requerAuth: false, somenteDeslogado: true },
  },
  {
    path: '/esqueci-senha',
    name: 'EsqueciSenha',
    component: () => import('../views/esqueci-senha/EsqueciSenha.vue'),
    meta: { requerAuth: false, somenteDeslogado: true },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/menu/Menu.vue'),
    meta: { requerAuth: false },
  },
  {
    path: '/sala-de-aula',
    name: 'SalaDeAula',
    component: () => import('../views/sala_de_aula/sala-de-aula.vue'),
    meta: { requerAuth: false },
  },
  {
    path: '/sala-de-aula/:salaId/aulas',
    name: 'ListaAulasSala',
    component: () => import('../views/sala_de_aula/Lista.vue'),
    props: true,
    meta: { requerAuth: false },
  },
  {
  path: '/aula/:id/:titulo/:nivel/:progresso/:videoId',
  name: 'Aula',
  component: () => import('../views/sala_de_aula/Aula.vue'),
  props: true, // Isso permite que os parâmetros virem variáveis automáticas
  meta: { requerAuth: false },
},
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: () => import('../views/sala_de_aula/favoritos.vue'),
    meta: { requerAuth: false },
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/sala_de_aula/perfil.vue'),
    meta: { requerAuth: false },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/chat/Chat.vue'),
    meta: { requerAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(), 
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  const precisaDeAuth    = to.meta.requerAuth === true
  const somenteDeslogado = to.meta.somenteDeslogado === true

  if (precisaDeAuth && !auth.estaAutenticado) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (somenteDeslogado && auth.estaAutenticado) {
    return next({ name: 'Menu' })
  }

  next()
})

export default router