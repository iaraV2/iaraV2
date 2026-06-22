<template>
  <div class="flex h-screen bg-slate-50 font-['Inter',_sans-serif] text-slate-800 overflow-hidden">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <aside 
      :class="menuExpandido ? 'w-64' : 'w-20'" 
      class="bg-slate-950 text-slate-200 flex flex-col shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out relative border-r border-slate-800"
    >
      <div class="h-16 flex items-center justify-between px-5 border-b border-slate-800/60 overflow-hidden">
        <div class="flex items-center min-w-0">
          <div class="w-8 h-8 bg-cyan-500 text-slate-950 rounded-lg flex items-center justify-center font-bold text-base shadow-md shadow-cyan-500/20 shrink-0">
            A
          </div>
          <h1 v-show="menuExpandido" class="text-base font-bold tracking-tight text-white ml-3 transition-opacity duration-200 whitespace-nowrap">
            IAra Admin
          </h1>
        </div>
        
        <button 
          @click="menuExpandido = !menuExpandido" 
          class="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:block shrink-0"
        >
          <svg class="w-5 h-5 transition-transform duration-300" :class="{'rotate-180': !menuExpandido}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        <p v-show="menuExpandido" class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 whitespace-nowrap">
          Gestão
        </p>

        <button @click="abaAtiva = 'aprovacoes'"
          :class="abaAtiva === 'aprovacoes' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'"
          class="w-full flex items-center p-2.5 rounded-xl text-sm transition-all duration-200 group relative"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          
          <div v-show="menuExpandido" class="flex items-center justify-between w-full ml-3 transition-opacity duration-200">
            <span class="whitespace-nowrap">Aprovações</span>
            <span v-if="solicitacoes.length > 0" class="bg-cyan-500 text-slate-950 py-0.5 px-2 rounded-full text-[10px] font-bold shadow-sm">
              {{ solicitacoes.length }}
            </span>
          </div>

          <span v-if="solicitacoes.length > 0 && !menuExpandido" class="absolute top-1 right-1 bg-cyan-500 text-slate-950 py-0.5 px-1.5 rounded-full text-[9px] font-bold shadow-sm">
            {{ solicitacoes.length }}
          </span>
        </button>

        <button @click="abaAtiva = 'professores'"
          :class="abaAtiva === 'professores' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'"
          class="w-full flex items-center p-2.5 rounded-xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Professores</span>
        </button>

        <button @click="abaAtiva = 'alunos'"
          :class="abaAtiva === 'alunos' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'"
          class="w-full flex items-center p-2.5 rounded-xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Alunos</span>
        </button>

        <button @click="abaAtiva = 'salas'"
          :class="abaAtiva === 'salas' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'"
          class="w-full flex items-center p-2.5 rounded-xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Salas de Aula</span>
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800/60">
        <button @click="auth.logout()"
          class="w-full flex items-center p-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-80 group-hover:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Sair do Sistema</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-full overflow-hidden">
      
      <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
        <div class="flex items-center gap-3">
          <button @click="menuExpandido = !menuExpandido" class="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">{{ tituloAbaAtual }}</h2>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            {{ auth.usuario?.nome || 'Administrador' }}
          </span>
          <div class="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-medium text-sm shadow-inner">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        <div class="max-w-6xl mx-auto w-full transition-all duration-300">

          <section v-if="abaAtiva === 'aprovacoes'">
            <div v-if="carregando" class="text-center text-slate-400 font-medium py-10 animate-pulse">Carregando solicitações...</div>
            
            <div v-else-if="solicitacoes.length === 0" class="bg-white border border-slate-150 rounded-2xl p-10 mt-4 text-center shadow-sm max-w-2xl mx-auto">
              <div class="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 class="text-base font-bold text-slate-900">Tudo em dia!</h3>
              <p class="text-sm text-slate-500 mt-1">Nenhuma solicitação de professor pendente de avaliação.</p>
            </div>

            <div v-else class="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden mt-2">
              <div class="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Professores em espera ({{ solicitacoes.length }})</span>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="prof in solicitacoes" :key="prof.id" class="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {{ prof.nome.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-slate-900 truncate">{{ prof.nome }}</h4>
                      <p class="text-xs text-slate-500 truncate mt-0.5">{{ prof.email }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button @click="tentarRejeitarProfessor(prof.id)" class="px-3 md:px-4 py-2 text-xs font-semibold text-rose-600 bg-transparent hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-full transition-all cursor-pointer">
                      Rejeitar
                    </button>
                    <button @click="aprovarProfessor(prof.id)" class="px-4 md:px-5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-sm shadow-slate-950/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                      Aprovar
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'professores'">
            <div v-if="professores.length === 0" class="text-center text-slate-400 py-10 mt-4">Nenhum professor ativo no sistema.</div>
            <div v-else class="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden mt-2">
              <ul class="divide-y divide-slate-100">
                <li v-for="prof in professores" :key="prof.id" class="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {{ prof.nome.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-slate-900 truncate">{{ prof.nome }}</h4>
                      <p class="text-xs text-slate-500 truncate mt-0.5">{{ prof.email }}</p>
                    </div>
                  </div>
                  <div class="shrink-0">
                    <button @click="tentarExcluirUsuario(prof.id, 'professor')" class="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-full transition-all cursor-pointer">
                      Excluir
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'alunos'">
            <div v-if="alunos.length === 0" class="text-center text-slate-400 py-10 mt-4">Nenhum aluno cadastrado no sistema.</div>
            <div v-else class="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden mt-2">
              <ul class="divide-y divide-slate-100">
                <li v-for="aluno in alunos" :key="aluno.id" class="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {{ aluno.nome.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-slate-900 truncate">{{ aluno.nome }}</h4>
                      <p class="text-xs text-slate-500 truncate mt-0.5">{{ aluno.email }}</p>
                    </div>
                  </div>
                  <div class="shrink-0">
                    <button @click="tentarExcluirUsuario(aluno.id, 'aluno')" class="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-full transition-all cursor-pointer">
                      Excluir
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section v-if="abaAtiva === 'salas'" class="mt-2">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div v-for="sala in salas" :key="sala.id" class="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-3">
                    <span class="bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider">
                      {{ sala.codigo }}
                    </span>
                  </div>
                  <h4 class="text-base font-bold text-slate-900 mb-1">{{ sala.nome }}</h4>
                  <p class="text-xs text-slate-500 mb-4 font-medium">Lecionado por: {{ sala.professorNome }}</p>
                </div>
                <div class="flex items-center text-xs text-slate-600 font-semibold border-t border-slate-100 pt-3 mt-1">
                  <svg class="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  {{ sala.qtdAlunos }} alunos matriculados
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <div v-if="modalConfirmacao.aberto" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 border border-slate-100 transform transition-all">
          <div class="flex items-center gap-3.5 mb-3">
            <div class="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900">{{ modalConfirmacao.titulo }}</h3>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed mb-6 pl-13">{{ modalConfirmacao.mensagem }}</p>
          <div class="flex justify-end gap-2.5">
            <button @click="fecharModal" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-colors cursor-pointer">
              Cancelar
            </button>
            <button @click="confirmarAcao" class="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-sm transition-colors cursor-pointer">
              Confirmar Exclusão
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

const menuExpandido = ref(true)
const abaAtiva      = ref('aprovacoes')
const carregando    = ref(false)

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

<style scoped>
.whitespace-nowrap {
  transition: opacity 0.2s ease-in-out;
}
</style>