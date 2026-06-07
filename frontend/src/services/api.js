//* esse arquivo é responsavel pela logistica de comunicação com o backend, interceptando a entrada de saida das requisições para adicionar o token
//*  e tratar erros como o 401(acesso negado) e 403(forbidden)
//* essa é uma instancia central do axios, para garantir que os interceptors sejam aplicados em todas as chamadas,
//*  sempre chamando esta instancia `api` e nunca o axios diretamente pra evitar boileplate de adicionar token manualmente e tratar erros em cada componente.

import axios from 'axios'

/**
 * Instância central do Axios para toda a aplicação.
 * NUNCA faça chamadas diretas com axios.get/post fora daqui —
 * sempre importe e use esta instância `api` para garantir
 * que os interceptors se apliquem.
 */


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/iara',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Interceptor de REQUISIÇÃO ─────────────────────────────────────────────
// Executado ANTES de cada chamada sair do browser.
// Responsabilidade: injetar o token JWT no cabeçalho Authorization.
api.interceptors.request.use(
  (config) => {
    // Lemos direto do localStorage para não criar dependência circular
    // com a store (a store importa api, api não pode importar a store).
    const token = localStorage.getItem('iara_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error) //? caso haja erro na configuração da requisição, rejeita a promise para o bloco catch do componente tratar (raro)
  }
)

// ─── Interceptor de RESPOSTA ───────────────────────────────────────────────
// Executado DEPOIS de cada resposta chegar do servidor.
// Responsabilidades:
//   401 → sessão inválida/expirada  → limpa dados e manda pro login
//   403 → sem permissão             → avisa o usuário
//   500 → erro no servidor          → mensagem genérica amigável


api.interceptors.response.use(
  (response) => response, // resposta 2xx — passa direto sem alteração

  (error) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn('[IAra] Sessão expirada ou inválida. Redirecionando para login.')
      localStorage.removeItem('iara_token')
      localStorage.removeItem('iara_usuario')

      // Redirecionamento global direto para evitar dependência circular com o router
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?sessao=expirada'
      }
    }

    if (status === 403) {
      console.warn('[IAra] Acesso negado pelo servidor.')
    }

    if (status >= 500) {
      console.error('[IAra] Erro interno do servidor:', error.response?.data)
    }

    // Sempre rejeita para que o bloco catch do componente possa tratar
    return Promise.reject(error)
  }
)