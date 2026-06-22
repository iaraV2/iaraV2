// frontend/src/router/index.js
// CORREÇÃO: Redirecionamento dinâmico baseado em Roles para evitar contaminação de telas

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/inicio/TelaInicio.vue'),
    meta: { requerAuth: false, somenteDeslogado: false, index: 1 },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
    meta: { requerAuth: false, somenteDeslogado: true, index: 2 },
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/cadastro/TelaCadastro.vue'),
    meta: { requerAuth: false, somenteDeslogado: true, index: 2 },
  },
  {
    path: '/esqueci-senha',
    name: 'EsqueciSenha',
    component: () => import('../views/esqueci-senha/EsqueciSenha.vue'),
    meta: { requerAuth: false, somenteDeslogado: true, index: 2 },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/menu/Menu.vue'),
    meta: { requerAuth: false, index: 3 },
  },
  {
    path: '/sala-de-aula',
    name: 'SalaDeAula',
    component: () => import('../views/sala_de_aula/sala-de-aula.vue'),
    meta: { requerAuth: false, index: 4 },
  },
  {
    path: '/sala-de-aula/:salaId/aulas',
    name: 'ListaAulasSala',
    component: () => import('../views/sala_de_aula/Lista.vue'),
    props: true,
    meta: { requerAuth: false, index: 5 },
  },
  {
    path: '/aula/:id/:titulo/:nivel/:progresso/:videoId',
    name: 'Aula',
    component: () => import('../views/sala_de_aula/Aula.vue'),
    props: true,
    meta: { requerAuth: false, index: 6 },
  },
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: () => import('../views/sala_de_aula/favoritos.vue'),
    meta: { requerAuth: false, index: 4 },
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/sala_de_aula/perfil.vue'),
    meta: { requerAuth: false, index: 4 },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/chat/Chat.vue'),
    meta: { requerAuth: false, index: 4 },
  },

  // ── Painel Admin ──────────────────────────────────────────────────────────
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: {
      requerAuth: true,
      requerRole: 'admin',
      index: 10
    },
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Helper dinâmico para descobrir a rota "Home" de cada perfil logado
const obterRotaPorRole = (role) => {
  if (role === 'admin') return { name: 'AdminDashboard' }
  if (role === 'professor') return { name: 'SalaDeAula' }
  return { name: 'Menu' } // Aluno ou padrão
}

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  const precisaDeAuth    = to.meta.requerAuth === true
  const somenteDeslogado = to.meta.somenteDeslogado === true
  const roleNecessaria   = to.meta.requerRole
  const roleDoUsuario    = auth.usuario?.role

  // 1. Rota privada sem sessão → Força Login
  if (precisaDeAuth && !auth.estaAutenticado) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Se o utilizador já estiver autenticado, aplicamos as travas de segurança
  if (auth.estaAutenticado) {
    
    // 2. Rota com role específica → Se não for a dele, joga-o para a sua devida Home
    if (roleNecessaria && roleDoUsuario !== roleNecessaria) {
      console.warn(`[Router] Acesso negado à rota ${to.path}: role "${roleDoUsuario}" não tem permissão.`)
      return next(obterRotaPorRole(roleDoUsuario))
    }

    // 3. Proteção para o botão "Voltar": Impede o Admin de cair em telas de Aluno (/menu, /chat) por engano
    if (roleDoUsuario === 'admin' && !to.path.startsWith('/admin') && to.path !== '/') {
      return next({ name: 'AdminDashboard' })
    }

    // 4. Impede o Professor de navegar acidentalmente para o menu exclusivo do aluno
    if (roleDoUsuario === 'professor' && to.path === '/menu') {
      return next({ name: 'SalaDeAula' })
    }
  }

  // 5. Rota exclusiva para deslogados (login, cadastro) com sessão ativa → Manda para a Home correspondente
  if (somenteDeslogado && auth.estaAutenticado) {
    return next(obterRotaPorRole(roleDoUsuario))
  }

  next()
})

export default router