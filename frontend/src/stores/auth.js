//! esse arquivo é a store de autenticação usando Pinia. Ele é responsável por gerenciar o estado de login do usuário,
//! armazenar o token JWT e os dados do usuário, e fornecer ações para login, logout e cadastro.
//! Ele também inclui lógica para verificar se o token expirou, decodificar o payload do JWT e calcular o tempo restante da sessão.
//! A store é projetada para ser simples e fácil de usar em toda a aplicação, evitando a necessidade de lidar com autenticação manualmente em cada componente.

import { defineStore } from 'pinia'
import { ref, computed } from 'vue' 
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {

  // ─── Estado ────────────────────────────────────────────────────────────────
  // Tenta ler do localStorage ao inicializar (sessão persistida) 
  const token = ref(localStorage.getItem('iara_token') || null)

  const usuario = ref(null)
  try {
    const usuarioStorage = localStorage.getItem('iara_usuario')
    usuario.value = usuarioStorage ? JSON.parse(usuarioStorage) : null
  } catch (error) {
    usuario.value = null
  }

  // ─── Getters ───────────────────────────────────────────────────────────────
  const estaAutenticado = computed(() => !!token.value && !tokenExpirado())

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Decodifica o payload do JWT sem biblioteca externa.
   * IMPORTANTE: isso NÃO valida a assinatura — a validação real é feita no backend.
   * Usamos isso apenas para checar a expiração (campo `exp`) no cliente,
   * evitando chamadas desnecessárias com token vencido.
   */
  function decodificarPayload(jwt) {
    try {
      const base64 = jwt.split('.')[1]
      const base64Padded = base64.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(base64Padded))
    } catch (error) {
      return null
    }
  }

  /**
   * Retorna true se o token já expirou ou está mal-formado.
   * O campo `exp` do JWT é um Unix timestamp em SEGUNDOS.
   */
  function tokenExpirado() {
    if (!token.value) return true
    const payload = decodificarPayload(token.value)
    if (!payload?.exp) return true
    return Date.now() / 1000 > payload.exp
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  /** Realiza o login, salva token e dados do usuário */
  async function login(email, senha) {
    const { data } = await api.post('/login', { email, senha })

    // 🔥 validação mínima (evita bug silencioso)
    if (!data || !data.token) {
      throw new Error('Token não recebido do servidor')
    }

    token.value = data.token
    usuario.value = data.usuario || null

    localStorage.setItem('iara_token', data.token)
    localStorage.setItem('iara_usuario', JSON.stringify(data.usuario || null))

    return data
  }

  /** Realiza o cadastro de novo usuário */
  async function cadastrar(nome, email, senha, tema) {
    const { data } = await api.post('/iara/cadastro', { nome, email, senha, tema })
    return data
  }

  /**
   * Limpa toda a sessão e redireciona para o login.
   * Chamado manualmente (botão sair) ou automaticamente pelo interceptor
   * de resposta quando o backend retorna 401.
   */
  function logout() {
    token.value = null
    usuario.value = null

    localStorage.removeItem('iara_token')
    localStorage.removeItem('iara_usuario')

    window.location.href = '/login?sessao=expirada'
  }

  /**
   * Retorna o tempo restante da sessão em minutos (útil para mostrar aviso na UI).
   * Retorna 0 se não há token ou se já expirou.
   */
  function minutosRestantes() {
    if (!token.value) return 0
    const payload = decodificarPayload(token.value)
    if (!payload?.exp) return 0
    const restante = payload.exp - Date.now() / 1000
    return restante > 0 ? Math.floor(restante / 60) : 0
  }

  return {
    token,
    usuario,
    estaAutenticado,
    tokenExpirado,
    login,
    cadastrar,
    logout,
    minutosRestantes,
  }
})