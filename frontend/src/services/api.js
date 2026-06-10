import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/iara',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (config.baseURL?.endsWith('/iara')) {
      config.baseURL = config.baseURL.replace(/\/iara$/, '')
    }

    if (config.url && !config.url.startsWith('/iara')) {
      const formatoComBarra = config.url.startsWith('/') ? config.url : '/' + config.url
      config.url = '/iara' + formatoComBarra
    }
    
    if (config.url?.startsWith('/iara/iara/')) {
      config.url = config.url.replace(/^\/iara\/iara\//, '/iara/')
    }

    const token = localStorage.getItem('iara_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn('[IAra] Sessão expirada ou inválida. Redirecionando para login.')
      localStorage.removeItem('iara_token')
      localStorage.removeItem('iara_usuario')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?sessao=expirada'
      }
    }

    if (status === 403) {
      console.warn('[IAra] Acesso negado pelo servidor.')
    }

    return Promise.reject(error)
  }
)