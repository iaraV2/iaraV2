  //! esse arquivo é a store de autenticação usando Pinia. Ele é responsável por gerenciar o estado de login do usuário,
  //! armazenar o token JWT e os dados do usuário, e fornecer ações para login, logout e cadastro.
  //! Ele também inclui lógica para verificar se o token expirou, decodificar o payload do JWT e calcular o tempo restante da sessão.
  //! A store é projetada para ser simples e fácil de usar em toda a aplicação, evitando a necessidade de lidar com autenticação manualmente em cada componente.

   
  import { defineStore } from 'pinia'
  import { ref, computed } from 'vue' 
  import { api } from '../services/api'
  import router from '../router'

  export const useAuthStore = defineStore('auth', () => {

    // ─── Estado ────────────────────────────────────────────────────────────────
    // Tenta ler do localStorage ao inicializar (sessão persistida) 
    const token   = ref(localStorage.getItem('iara_token') || null) //? verifi
    const usuario = ref(JSON.parse(localStorage.getItem('iara_usuario') || 'null'))

    

    // ─── Getters ───────────────────────────────────────────────────────────────
    const estaAutenticado = computed(() => !!token.value && !tokenExpirado()) //? true se há token e ele não expirou; se o token expirou, mesmo que exista, esta não autenticado usando o ! e !!
                                                                              //?  ! para negar o valor (transforma truthy em false e falsy em true) e !! para transformar qualquer valor em booleano (true ou false)



    // ─── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Decodifica o payload do JWT sem biblioteca externa.
     * IMPORTANTE: isso NÃO valida a assinatura — a validação real é feita no backend.
     * Usamos isso apenas para checar a expiração (campo `exp`) no cliente,
     * evitando chamadas desnecessárias com token vencido.
     */
    function decodificarPayload(jwt) {
      try {
        // JWT = header.payload.signature — pegamos só o payload (índice 1)
        const base64 = jwt.split('.')[1]
        // O base64url usa - e _ em vez de + e /; corrigimos antes de decodificar
        const base64Padded = base64.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64Padded))
      } catch {
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
      // Date.now() retorna milissegundos — dividimos por 1000 para comparar
      return Date.now() / 1000 > payload.exp
    }

    // ─── Actions ───────────────────────────────────────────────────────────────

    /** Realiza o login, salva token e dados do usuário */
    async function login(email, senha) {
      // api.js não adiciona token em rotas públicas — chamada limpa
      const { data } = await api.post('/usuarios/login', { email, senha })

      // Persiste no estado reativo
      token.value   = data.token
      usuario.value = data.usuario

      // Persiste no localStorage para sobreviver a F5
      localStorage.setItem('iara_token',   data.token)
      localStorage.setItem('iara_usuario', JSON.stringify(data.usuario))

      return data
    }

    /** Realiza o cadastro de novo usuário */
    async function cadastrar(nome, email, senha, tema, role = 'aluno') {
      const { data } = await api.post('/usuarios/cadastro', { nome, email, senha, tema })
      return data
    }

    /**
     * Limpa toda a sessão e redireciona para o login.
     * Chamado manualmente (botão sair) ou automaticamente pelo interceptor
     * de resposta quando o backend retorna 401.
     */
    function logout() {
      token.value   = null
      usuario.value = null

      localStorage.removeItem('iara_token')
      localStorage.removeItem('iara_usuario')

      // Redireciona para login passando uma flag de aviso opcional
      router.push({ name: 'Login', query: { sessao: 'expirada' } })
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