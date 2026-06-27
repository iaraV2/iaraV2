<template>
  <div class="flex h-screen bg-slate-50 font-['Inter',_sans-serif] text-slate-800 overflow-x-hidden">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Overlay para mobile drawer -->
    <div 
      v-if="menuExpandido" 
      @click="menuExpandido = false" 
      class="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed md:relative inset-y-0 left-0 z-30 bg-slate-950 text-slate-200 flex flex-col shadow-2xl md:shadow-xl transition-all duration-300 ease-in-out border-r border-slate-800 h-full',
        menuExpandido ? 'translate-x-0 w-[clamp(260px,18vw,300px)]' : '-translate-x-full md:translate-x-0 md:w-[72px]'
      ]"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-slate-800/60 overflow-hidden shrink-0">
        <div class="flex items-center min-w-0">
         
          <h1 v-show="menuExpandido" class=" relative left-19  text-lg font-bold tracking-tight text-white ml-3 transition-opacity duration-200 whitespace-nowrap">
            IARA  ADMIN
          </h1>
        </div>
        
        <!-- Toggle button (desktop only) -->
        <button 
          @click="menuExpandido = !menuExpandido" 
          class="relative -left-[1rem] p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:block shrink-0"
        >
          <svg class="relative -left-[0rem] w-5 h-5 transition-transform duration-300" :class="{'rotate-180': !menuExpandido}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </div>

     <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <!-- TEXTO GESTÃO PRINCIPAL CENTRALIZADO -->
        <p v-show="menuExpandido" class="text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 whitespace-nowrap">
          Gestão Principal
        </p>

        <!-- Aprovações -->
       <button @click="mudarAba('aprovacoes')"
  :class="abaAtiva === 'aprovacoes' ? 'bg-cyan-500/10 text-cyan-400 font-semibold shadow-inner border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'"
  class="w-full flex items-center p-3 rounded-2xl text-sm transition-all duration-200 group relative justify-center md:justify-start"
>
  <div class="w-6 h-6 flex items-center justify-center shrink-0 relative">
    <svg class="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    
    <span v-if="solicitacoes.length > 0 && !menuExpandido" 
      class="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 min-w-[18px] h-4.5 flex items-center justify-center rounded-full text-[9px] font-black shadow-md border border-slate-950 px-1 animate-pulse"
    >
      {{ solicitacoes.length }}
    </span>
  </div>
  
  <div v-show="menuExpandido" class="flex items-center justify-between w-full ml-3 transition-opacity duration-200">
    <span class="whitespace-nowrap">Aprovações</span>
    
    <span v-if="solicitacoes.length > 0" 
      class="bg-cyan-500 text-slate-950 py-0.5 px-3 rounded-full text-[11px] font-black shadow-md min-w-[28px] text-center"
    >
      {{ solicitacoes.length }}
    </span>
  </div>
</button>
        <!-- Professores -->
        <button @click="mudarAba('professores')"
          :class="abaAtiva === 'professores' ? 'bg-slate-800 text-white font-semibold shadow-inner border border-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'"
          class="w-full flex items-center p-3 rounded-2xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Professores</span>
        </button>

        <!-- Alunos -->
        <button @click="mudarAba('alunos')"
          :class="abaAtiva === 'alunos' ? 'bg-slate-800 text-white font-semibold shadow-inner border border-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'"
          class="w-full flex items-center p-3 rounded-2xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Alunos</span>
        </button>

        <!-- Salas -->
        <button @click="mudarAba('salas')"
          :class="abaAtiva === 'salas' ? 'bg-slate-800 text-white font-semibold shadow-inner border border-slate-700' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'"
          class="w-full flex items-center p-3 rounded-2xl text-sm transition-all duration-200 group"
        >
          <div class="w-6 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <span v-show="menuExpandido" class="ml-3 transition-opacity duration-200 whitespace-nowrap">Salas de Aula</span>
        </button>
      </nav>

      <!-- Perfil do Administrador (Visível apenas em mobile) -->
   <div v-show="menuExpandido" class="w-full flex items-center p-3 px-3 rounded-2xl text-sm text-slate-400 md:hidden">
        <div class="w-6 h-6 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span class="ml-3 font-semibold text-slate-300 truncate">
          {{ auth.usuario?.nome || 'Administrador' }}
        </span>
      </div>

      <!-- Logout button -->
      <div class="p-3 border-t border-slate-800/60">
        <button @click="auth.logout()"
          class="w-[106%] relative -left-2 flex items-center p-3 rounded-2xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all cursor-pointer group"
        >
          <div class="w-10 h-6 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 relative -left-2 opacity-80 group-hover:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </div>
          <span v-show="menuExpandido" class="  ml-3 transition-opacity duration-200 whitespace-nowrap relative -left-4  text-center">Sair do Sistema</span>
        </button>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      
      <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 z-10 sticky top-0 shadow-sm">
        <div class="flex items-center gap-4 flex-1">
          <button @click="menuExpandido = !menuExpandido" class="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors z-20">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="flex-1 md:flex-none text-center md:text-left absolute left-0 right-0 mx-auto lg:relative lg:left-3 lg:right-auto pointer-events-none">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight pointer-events-auto">{{ tituloAbaAtual }}</h2>
            <p class="text-xs text-slate-500 font-medium hidden md:block pointer-events-auto">Gerencie as informações do sistema</p>
          </div>
        </div>
        <!-- User info with truncation (hidden on mobile) -->
        <div class="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          <span class="text-sm font-semibold text-slate-700 max-w-[180px] truncate relative left-2">
            {{ auth.usuario?.nome || 'Administrador' }}
          </span>
          <!-- CONTAINER DO AVATAR COM AJUSTE DE ALINHAMENTO INTERNO -->
          <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white font-medium text-sm shadow-md shrink-0 pl-0.5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
          </div>
        </div>
      </header>

      <!-- Main content with centered container -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light">
        <div class="container-dashboard w-full max-w-[1400px] mx-auto">

     
<!-- Aprovações Section -->
         <section v-if="abaAtiva === 'aprovacoes'" class="animate-fadeIn w-full flex flex-col pt-2 pb-8" :class="{'min-h-[calc(100vh-160px)] justify-center items-center': solicitacoes.length === 0}">
  
  <div v-if="carregando" class="text-center text-slate-400 font-medium py-12 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse w-full max-w-[700px] mx-auto">
    Carregando solicitações...
  </div>
  
  <div v-else-if="solicitacoes.length === 0" class="bg-white border border-slate-200 rounded-3xl p-6 sm:py-20 sm:px-16 text-center shadow-md max-w-[700px] w-full transform hover:scale-[1.01] transition-transform flex flex-col items-center justify-center">
    <h3 class="text-xl sm:text-2xl font-bold text-slate-900">Tudo em dia!</h3>
    <p class="text-sm sm:text-base text-slate-500 mt-3 mb-10 max-w-[450px]">Nenhuma solicitação de professor pendente de avaliação no momento.</p>
    <div class="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm transition-transform duration-300 hover:rotate-6">
      <svg class="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
  </div>

  <div v-else class="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden w-full">
    <ul class="divide-y divide-slate-100">
      
      <li v-for="prof in solicitacoes" :key="prof.id" class="p-4 md:py-5 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
        
        <div class="flex items-center gap-4 min-w-0 md:flex-1 md:translate-x-2">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {{ prof.nome.charAt(0).toUpperCase() }}
          </div>
          
          <div class="min-w-0 flex-1">
            <h4 class="text-base font-bold text-slate-900 truncate">{{ prof.nome }}</h4>
            <p class="text-sm text-slate-500 truncate mt-0.5">{{ prof.email }}</p>
          </div>
        </div>
        
        <div class="w-full md:w-auto md:flex-1 md:max-w-[450px] md:mr-28 flex justify-center md:justify-end gap-3 shrink-0 mt-1 md:mt-0">
          <button @click="tentarRejeitarProfessor(prof.id)" 
                  class="px-6 py-2.5 text-sm font-bold text-rose-600 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow w-28 text-center">
            Rejeitar
          </button>
          
          <button @click="aprovarProfessor(prof.id)" 
                  class="px-6 py-2.5 text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-md shadow-cyan-500/30 transition-all hover:-translate-y-0.5 cursor-pointer w-28 text-center">
            Aprovar
          </button>
        </div>

      </li>
    </ul>
  </div>
</section>

        <section v-if="abaAtiva === 'professores'" class="animate-fadeIn">
  <div v-if="professores.length === 0" class="text-center text-slate-400 py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">Nenhum professor ativo no sistema.</div>
  <div v-else class="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
    <ul class="divide-y divide-slate-100">
      
      <li v-for="prof in professores" :key="prof.id" class="p-4 md:py-5 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
        
        <div class="flex items-center gap-4 min-w-0 md:flex-1">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {{ prof.nome.charAt(0).toUpperCase() }}
          </div>
          
          <div class="min-w-0 flex-1">
            <h4 class="text-base font-bold text-slate-900 truncate">{{ prof.nome }}</h4>
            <p class="text-sm text-slate-500 truncate mt-0.5">{{ prof.email }}</p>
          </div>
        </div>
        
        <div class="w-full md:w-auto flex justify-center md:justify-end shrink-0 mt-1 md:mt-0">
          <button @click="tentarExcluirUsuario(prof.id, 'professor')" 
                  class="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/30 transition-all hover:-translate-y-0.5 cursor-pointer w-20">
            Excluir
          </button>
        </div>

      </li>
    </ul>
  </div>
</section>

         <section v-if="abaAtiva === 'alunos'" class="animate-fadeIn">
  <div v-if="alunos.length === 0" class="text-center text-slate-400 py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">Nenhum aluno cadastrado no sistema.</div>
  <div v-else class="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
    <ul class="divide-y divide-slate-100">
      
      <li v-for="aluno in alunos" :key="aluno.id" class="p-4 md:py-5 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
        
        <div class="flex items-center gap-4 min-w-0 md:flex-1 md:translate-x-2">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {{ aluno.nome.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-base font-bold text-slate-900 truncate">{{ aluno.nome }}</h4>
            <p class="text-sm text-slate-500 truncate mt-0.5">{{ aluno.email }}</p>
          </div>
        </div>
        
        <div class="w-full md:w-auto flex justify-center md:justify-end shrink-0 mt-2 md:mt-0">
          <button @click="tentarExcluirUsuario(aluno.id, 'aluno')" 
                  class="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/30 transition-all hover:-translate-y-0.5 cursor-pointer w-20">
            Excluir
          </button>
        </div>

      </li>
    </ul>
  </div>
</section>

          <!-- Salas Section with responsive grid -->
          <section v-if="abaAtiva === 'salas'" class="animate-fadeIn">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div v-for="sala in salas" :key="sala.id" class="bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div class="flex justify-between items-start mb-4">
                    <span class="bg-slate-900 text-cyan-400 border border-slate-800 text-[11px] font-black px-3 py-1.5 rounded-lg tracking-widest shadow-sm">
                      {{ sala.codigo }}
                    </span>
                  </div>
                  <h4 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">{{ sala.nome }}</h4>
                  <p class="text-sm text-slate-500 mb-6 font-medium">Lecionado por: <span class="text-slate-700">{{ sala.professorNome }}</span></p>
                </div>
                <div class="flex items-center text-sm text-slate-600 font-semibold border-t border-slate-100 pt-4 mt-2">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                  {{ sala.qtdAlunos }} alunos matriculados
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <div v-if="modalConfirmacao.aberto" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md transition-opacity">
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 border border-slate-100 transform transition-all scale-100 animate-modalPop">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-rose-50 border-4 border-white shadow-md flex items-center justify-center mb-4 shrink-0">
              <svg class="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ modalConfirmacao.titulo }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ modalConfirmacao.mensagem }}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row justify-center gap-3 w-full mt-2">
            <button @click="fecharModal" class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
              Cancelar
            </button>
            <button @click="confirmarAcao" class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/30 transition-all hover:-translate-y-0.5 cursor-pointer">
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

// Função para fechar menu no mobile ao clicar em uma aba
function mudarAba(aba) {
  abaAtiva.value = aba
  if (window.innerWidth < 768) {
    menuExpandido.value = false
  }
}

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
  // Ajuste inicial para mobile: fechar menu por padrão
  if (window.innerWidth < 768) {
    menuExpandido.value = false
  }
  buscarSolicitacoes()
  buscarUsuarios()
})
</script>

<style scoped>
/* Container principal */
.container-dashboard {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: clamp(1rem, 2vw, 2rem);
}

/* Impede overflow horizontal */
body {
  overflow-x: hidden;
}

/* Nomes grandes com truncamento */
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.whitespace-nowrap {
  transition: opacity 0.2s ease-in-out;
}

/* Animações adicionais para polimento visual */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-modalPop {
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Design System - Escalas consistentes */
/* Border Radius */
.rounded-sm { border-radius: 0.375rem; }
.rounded-md { border-radius: 0.5rem; }
.rounded-lg { border-radius: 0.75rem; }
.rounded-xl { border-radius: 1rem; }
.rounded-2xl { border-radius: 1.5rem; }
.rounded-3xl { border-radius: 2rem; }

/* Shadows */
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }

/* Typography Scale */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }

/* Spacing Scale */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }
.m-6 { margin: 1.5rem; }
.m-8 { margin: 2rem; }
</style>