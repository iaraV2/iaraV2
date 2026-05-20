<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

    <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20 shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-gray-800">
        <div class="w-8 h-8 bg-cyan-400 text-gray-900 rounded flex items-center justify-center font-bold text-lg mr-3">A</div>
        <h1 class="text-xl font-bold tracking-tight text-white">IAra Admin</h1>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gestão</p>

        <button @click="abaAtiva = 'aprovacoes'"
          :class="abaAtiva === 'aprovacoes' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Aprovações
          <span v-if="solicitacoes.length > 0" class="ml-auto bg-cyan-500 text-gray-900 py-0.5 px-2 rounded-full text-xs font-bold">{{ solicitacoes.length }}</span>
        </button>

        <button @click="abaAtiva = 'professores'"
          :class="abaAtiva === 'professores' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Professores
        </button>

        <button @click="abaAtiva = 'alunos'"
          :class="abaAtiva === 'alunos' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          Alunos
        </button>

        <button @click="abaAtiva = 'salas'"
          :class="abaAtiva === 'salas' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Salas de Aula
        </button>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button @click="auth.logout()"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sair do Sistema
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-full overflow-hidden relative">
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
        <h2 class="text-xl font-bold text-gray-800 tracking-tight">{{ tituloAbaAtual }}</h2>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-500">{{ auth.usuario?.nome || 'Administrador' }}</span>
          <div class="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-8">
        <div class="max-w-4xl mx-auto w-full">

          <section v-if="abaAtiva === 'aprovacoes'">
            <div v-if="carregando" class="text-center text-gray-400 mt-16">Carregando...</div>
            <div v-else-if="solicitacoes.length === 0" class="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
              <div class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Nenhuma solicitação pendente</h3>
              <p class="text-sm text-gray-500 mt-1">Todos os professores já foram avaliados.</p>
            </div>
            <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <ul class="divide-y divide-gray-200">
                <li v-for="prof in solicitacoes" :key="prof.id" class="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">{{ prof.nome.charAt(0).toUpperCase() }}</div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">{{ prof.nome }}</h4>
                      <p class="text-sm text-gray-500">{{ prof.email }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="tentarRejeitarProfessor(prof.id)" class="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer">Rejeitar</button>
                    <button @click="aprovarProfessor(prof.id)" class="px-4 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-md shadow-sm transition-colors cursor-pointer">Aprovar</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'professores'">
            <div v-if="professores.length === 0" class="text-center text-gray-500 mt-10">Nenhum professor ativo.</div>
            <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <ul class="divide-y divide-gray-200">
                <li v-for="prof in professores" :key="prof.id" class="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{{ prof.nome.charAt(0).toUpperCase() }}</div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">{{ prof.nome }}</h4>
                      <p class="text-sm text-gray-500">{{ prof.email }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="tentarExcluirUsuario(prof.id, 'professor')" class="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer">Excluir</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'alunos'">
            <div v-if="alunos.length === 0" class="text-center text-gray-500 mt-10">Nenhum aluno cadastrado.</div>
            <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <ul class="divide-y divide-gray-200">
                <li v-for="aluno in alunos" :key="aluno.id" class="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">{{ aluno.nome.charAt(0).toUpperCase() }}</div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">{{ aluno.nome }}</h4>
                      <p class="text-sm text-gray-500">{{ aluno.email }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="tentarExcluirUsuario(aluno.id, 'aluno')" class="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer">Excluir</button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'salas'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="sala in salas" :key="sala.id" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                  <span class="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-md">{{ sala.codigo }}</span>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-1">{{ sala.nome }}</h4>
                <p class="text-sm text-gray-500 mb-4">Prof: {{ sala.professorNome }}</p>
                <div class="flex items-center text-sm text-gray-600 font-medium border-t border-gray-100 pt-3">
                  <svg class="w-4 h-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  {{ sala.qtdAlunos }} Alunos matriculados
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <div v-if="modalConfirmacao.aberto" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 transform transition-all">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">{{ modalConfirmacao.titulo }}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-6 pl-14">{{ modalConfirmacao.mensagem }}</p>
          <div class="flex justify-end gap-3">
            <button @click="fecharModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
              Cancelar
            </button>
            <button @click="confirmarAcao" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer">
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }    from '../../stores/auth.js'
import { useToast }        from 'vue-toastification'
import { api }             from '../../services/api.js'

const auth    = useAuthStore()
const toast   = useToast()

const abaAtiva   = ref('aprovacoes')
const carregando = ref(false)

const tituloAbaAtual = computed(() => ({
  aprovacoes: 'Aprovações Pendentes',
  professores: 'Gerenciar Professores',
  alunos:      'Gerenciar Alunos',
  salas:       'Salas de Aula Ativas',
})[abaAtiva.value])

const solicitacoes = ref([])
const professores  = ref([])
const alunos       = ref([])
const salas        = ref([
  { id: '101', nome: 'Programação Web I',    codigo: 'IARA-WEB1', professorNome: 'Alan Turing',     qtdAlunos: 42 },
  { id: '102', nome: 'Sistemas Operacionais', codigo: 'IARA-SYS2', professorNome: 'Linus Torvalds', qtdAlunos: 28 },
])

// ESTADO DO MODAL DE CONFIRMAÇÃO
const modalConfirmacao = ref({
  aberto: false,
  titulo: '',
  mensagem: '',
  acaoPendente: null
})

function abrirModal(titulo, mensagem, acao) {
  modalConfirmacao.value = { aberto: true, titulo, mensagem, acaoPendente: acao }
}

function fecharModal() {
  modalConfirmacao.value.aberto = false
}

async function confirmarAcao() {
  if (modalConfirmacao.value.acaoPendente) {
    await modalConfirmacao.value.acaoPendente()
  }
  fecharModal()
}

// INTEGRAÇÃO COM A API
async function buscarSolicitacoes() {
  carregando.value = true
  try {
    const { data } = await api.get('/admin/solicitacoes')
    solicitacoes.value = data
  } catch (e) {
    toast.error('Erro ao buscar aprovações pendentes.')
    console.error(e)
  } finally {
    carregando.value = false
  }
}

async function buscarUsuarios() {
  try {
    const { data } = await api.get('/admin/usuarios')
    professores.value = data.filter(u => u.role === 'professor')
    alunos.value      = data.filter(u => u.role === 'aluno')
  } catch (e) {
    toast.error('Erro ao carregar lista de usuários.')
    console.error(e)
  }
}

async function aprovarProfessor(id) {
  try {
    const { data } = await api.patch(`/admin/aprovar/${id}`)
    toast.success(data.mensagem || 'Professor aprovado!')
    await buscarSolicitacoes()
    await buscarUsuarios()
  } catch (e) {
    toast.error(e.response?.data?.erro || 'Erro ao aprovar professor.')
  }
}

function tentarRejeitarProfessor(id) {
  abrirModal(
    'Rejeitar Professor',
    'Tem certeza que deseja rejeitar e remover o cadastro deste professor?',
    async () => {
      try {
        const { data } = await api.delete(`/admin/rejeitar/${id}`)
        toast.success(data.mensagem || 'Solicitação rejeitada.')
        await buscarSolicitacoes()
      } catch (e) {
        toast.error(e.response?.data?.erro || 'Erro ao rejeitar professor.')
      }
    }
  )
}

function tentarExcluirUsuario(id, tipo) {
  abrirModal(
    'Excluir Usuário',
    `Tem certeza que deseja excluir permanentemente o cadastro deste ${tipo}? A ação não pode ser desfeita.`,
    async () => {
      try {
        const { data } = await api.delete(`/admin/usuarios/${id}`)
        toast.success(data.mensagem || `${tipo} excluído!`)
        await buscarUsuarios()
      } catch (e) {
        toast.error(e.response?.data?.erro || `Erro ao excluir ${tipo}.`)
      }
    }
  )
}

onMounted(() => {
  buscarSolicitacoes()
  buscarUsuarios()
})
</script>