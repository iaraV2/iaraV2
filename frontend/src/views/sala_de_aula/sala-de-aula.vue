<template>
  <div class="w-full h-full flex flex-col items-center py-6 px-6 overflow-y-auto overflow-x-hidden font-['Quicksand'] hide-scrollbar relative bg-[#380075] bg-fundo-default">
    <!-- Abstract shapes -->
    <div class="absolute top-20 left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <!-- Purple circles -->
    <div class="absolute -top-20 -left-10 w-40 h-40 sm:w-90 sm:h-90 rounded-full opacity-40 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-20 right-10 w-32 h-32 sm:top-40 sm:right-32 sm:w-70 sm:h-70 rounded-full opacity-35 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 sm:bottom-48 sm:left-40 sm:w-50 sm:h-50 rounded-full opacity-18 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-32 right-10 w-20 h-20 sm:bottom-32 sm:right-40 sm:w-44 sm:h-44 rounded-full opacity-15 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-60 left-5 w-8 h-8 sm:top-80 sm:left-16 sm:w-9 sm:h-9 rounded-full opacity-12 z-0" style=" background-color: #7a3cae;"></div>
  

    <button
      class="fixed top-8 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.push('/menu')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <div class="w-full text-center mt-16 mb-8 shrink-0 relative">
      <button v-if="isProfessor" @click="abrirModalNovaTurma"
        class="fixed top-8 right-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 5v14M5 12h14"/></svg>
      </button>
      <button v-if="!isProfessor" @click="mostrarModalCodigoTurma = true"
        class="fixed top-8 right-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95" title="Procurar turma">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      <h1 class="text-cyan-400 font-light text-2xl md:text-3xl leading-tight relative top-5">Bem-Vindo à</h1>
      <h1 class="text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-5">Sala de aula</h1>
    </div>

    <div class="w-full flex-grow flex items-center justify-center">
      <div class="w-full max-w-6xl">

        <div v-if="carregando" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-white/60 text-sm">Carregando suas salas...</p>
        </div>

        <div v-else-if="!isProfessor && cursos.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <span class="text-6xl">🏫</span>
          <p class="text-white font-bold text-xl">Você ainda não está em nenhuma sala</p>
          <p class="text-white/60 text-sm">Clique na lupa no canto superior direito para buscar e entrar em uma sala</p>
        </div>

        <div v-else class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center sm:mt-0 mt-40 relative top-10 z-10">
          <div v-for="c in cursosVisiveis" :key="c.id"
            class="bg-white rounded-3xl flex flex-col items-center text-center transition-all duration-300 group relative overflow-hidden shadow-2xl hover:shadow-3xl hover:-translate-y-2 pb-6 w-full max-w-[320px] sm:max-w-none h-[280px]">

            <button v-if="isProfessor" @click="excluirTurma(c.id)"
              class="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-red-500/90 backdrop-blur-md rounded-full text-white cursor-pointer transition-all duration-300 hover:bg-red-600 hover:scale-110 active:scale-95 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <button v-if="isProfessor" @click="abrirModalEditarTurma(c)"
              class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-cyan-400/90 backdrop-blur-md rounded-full text-[#420583] cursor-pointer transition-all duration-300 hover:bg-cyan-300 hover:scale-110 active:scale-95 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>

            <div class="w-full h-28 flex items-center justify-center mb-4 shadow-inner relative overflow-hidden" :style="{ backgroundColor: c.cor }">
              <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              <span class="text-6xl drop-shadow-lg relative z-10">{{ c.icone }}</span>
              <!-- Ghost icon based on course title -->
              <div v-if="typeof c.id === 'number' && c.id >= 1 && c.id <= 6" class="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
                <svg v-if="c.titulo.includes('Instagram')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <svg v-else-if="c.titulo.includes('Financeiro')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M3 3v18h18v-2H5V3H3zm4 14h2v-7H7v7zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z"/></svg>
                <svg v-else-if="c.titulo.includes('WhatsApp')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <svg v-else-if="c.titulo.includes('Digital')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm-3-7c-1.38 0-2.5-1.12-2.5-2.5S10.62 6 12 6s2.5 1.12 2.5 2.5S13.38 11 12 11z"/></svg>
                <svg v-else-if="c.titulo.includes('Segurança')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                <svg v-else-if="c.titulo.includes('Canva')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 text-white"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg>
              </div>
            </div>
            <div class="px-6 flex flex-col items-center flex-grow w-full">
              <h3 class="text-[#420583] font-bold text-xl mb-2 leading-tight line-clamp-2">{{ c.titulo }}</h3>
              <p class="text-sm mb-3 font-medium">
                <span class="text-[#420583]">Nível:</span>
                <span :style="{ color: c.cor }"> {{ c.nivel }}</span>
              </p>
              <div class="w-[83%] mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600">Progresso</span>
                  <span class="font-bold text-[#420583]">{{ c.progresso }}%</span>
                </div>
                <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500 ease-out" :style="{ width: c.progresso + '%', backgroundColor: c.cor }"></div>
                </div>
              </div>
              <button @click="irParaListaAulas(c)"
                :class="[
                  'mt-auto text-white font-bold h-[28%] relative top-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 w-[83%] cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2',
                  c.progresso === 0 
                    ? 'hover:opacity-90' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                ]"
                :style="c.progresso === 0 ? { backgroundColor: c.cor } : {}">
                <svg v-if="c.progresso === 100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else-if="c.progresso === 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                {{ c.progresso === 100 ? 'Rever' : c.progresso === 0 ? 'Acessar' : 'Continuar' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="h-24 shrink-0"></div>
    
    
    <FooterAnjos wrapper-class="mt-2 mb-6 shrink-0" img-class="w-32 opacity-70" />

    <SalaBottomNav />

    <SalaModals
      :mostrarModalNovaTurma="mostrarModalNovaTurma"
      :mostrarModalEditarTurma="mostrarModalEditarTurma"
      :mostrarModalCodigoTurma="mostrarModalCodigoTurma"
      :mostrarModalInserirCodigo="mostrarModalInserirCodigo"
      :etapa="etapa"
      :novaTurma="novaTurma"
      :novaAula="novaAula"
      :turmaEditando="turmaEditando"
      :turmaSelecionada="turmaSelecionada"
      :tituloBusca="tituloBusca"
      :resultadosBusca="resultadosBusca"
      :buscando="buscando"
      :codigoTurmaInput="codigoTurmaInput"
      :cores="cores"
      :emojis="emojis"

      @fechar-modal-busca="fecharModalBusca"
      @fechar-modal-codigo="fecharModalInserirCodigo"
      @criar-turma="criarTurma"
      @criar-aula="criarAula"
      @salvar-edicao="salvarEdicaoTurma"
      @buscar-titulo="buscarTurmasPorTituloLocal"
      @verificar-codigo="verificarCodigoEntrar"
      @entrar-turma-direto="entrarTurmaDireto"
      @handle-pdf="handlePdfUpload"
      @update:etapa="etapa = $event"
      @update:novaTurma="novaTurma = $event"
      @update:novaAula="novaAula = $event"
      @update:turmaEditando="turmaEditando = $event"
      @update:turmaSelecionada="turmaSelecionada = $event"
      @update:tituloBusca="tituloBusca = $event"
      @update:codigoTurmaInput="codigoTurmaInput = $event"
      @update:mostrarModalNovaTurma="mostrarModalNovaTurma = $event"
      @update:mostrarModalEditarTurma="mostrarModalEditarTurma = $event"
      @update:mostrarModalCodigoTurma="mostrarModalCodigoTurma = $event"
      @update:mostrarModalInserirCodigo="mostrarModalInserirCodigo = $event"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import FooterAnjos from '../../components/sala/FooterAnjos.vue'
import SalaModals  from '../../components/sala/SalaModals.vue'
import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'

import { useAuthStore } from '../../stores/auth.js'
import { useToast } from 'vue-toastification'
import {
  buscarTurmasPorTitulo, buscarTodasTurmas, buscarTurmaPorCodigo,
  salvarTurma, salvarAula, atualizarTurma,
  excluirTurma as deletarTurmaApi, uploadPdf, buscarMinhasTurmasAluno,
} from '../../services/firebase.js'
import { api } from '../../services/api.js'

// ─── Estado global da tela ────────────────────────────────────────────────────
const router      = useRouter()
const authStore   = useAuthStore()
const toast       = useToast()
const isProfessor = computed(() => authStore.usuario?.role === 'professor')

const cursos     = ref([])
const carregando = ref(true)

// Modais
const mostrarModalNovaTurma     = ref(false)
const mostrarModalEditarTurma   = ref(false)
const mostrarModalCodigoTurma   = ref(false)
const mostrarModalInserirCodigo = ref(false)

// Formulários
const etapa            = ref('turma')
const turmaTemp        = ref(null)
const turmaEditando    = ref(null)
const turmaSelecionada = ref(null)
const codigoTurmaInput = ref('')
const tituloBusca      = ref('')
const resultadosBusca  = ref([])
const buscando         = ref(false)

const cores  = ['#FFD700','#25D366','#C13584','#2A52BE','#00C4CC','#85bb65','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4']
const emojis = ['🌻','📱','📸','🛡️','🎨','💰','🚀','💡','🎯','📚','🎓','💻','🌟','🔥','⭐','🎵','🎬','🎮','🏆','💎','🌈','☀️','🌙','🍎','🍕','🚗','✈️','🏠','🌺','🦋','🐱','🐶']

const novaTurma = ref({ titulo: '', codigo: '', cor: '#FFD700', icone: '🌻', nivel: 'Iniciante' })
const novaAula  = ref({ titulo: '', dataLancamento: '', liberado: true, videoId: '', descricao: '', topicosTexto: '', topicos: [], pdfs: [] })

const turmasDesbloqueadas = ref([])

function carregarTurmasDesbloqueadas() {
  try {
    const desbloqueadas = localStorage.getItem('iara_turmas_desbloqueadas')
    if (desbloqueadas) {
      const parsed = JSON.parse(desbloqueadas)
      turmasDesbloqueadas.value = Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.warn('[SalaDeAula] Cache está corrompido. Resetando o histórico de turmas locais.')
    turmasDesbloqueadas.value = []
    localStorage.removeItem('iara_turmas_desbloqueadas')
  }
}

function salvarTurmaDesbloqueada(turmaId) {
  if (!Array.isArray(turmasDesbloqueadas.value)) {
    turmasDesbloqueadas.value = []
  }
  
  const idString = String(turmaId)
  if (!turmasDesbloqueadas.value.includes(idString)) {
    turmasDesbloqueadas.value.push(idString)
    localStorage.setItem('iara_turmas_desbloqueadas', JSON.stringify(turmasDesbloqueadas.value))
  }
}

function turmaEstaDesbloqueada(turmaId) {
  return turmasDesbloqueadas.value.includes(String(turmaId))
}

// Computed property para filtrar cursos visíveis
const cursosVisiveis = computed(() => {
  if (isProfessor.value) {
    return cursos.value
  }
  return cursos.value.filter(c => turmaEstaDesbloqueada(c.id))
})

// ─── Carregamento das turmas ──────────────────────────────────────────────────

async function recarregarCursos() {
  carregando.value = true
  try {
    const turmasDoBackend = await buscarTodasTurmas()
    
    if (isProfessor.value) {
      cursos.value = (turmasDoBackend || []).map(t => ({
        id:        t.id,
        titulo:    t.nome || t.titulo || 'Sem título',
        cor:       t.cor      || '#FFD700',
        icone:     t.icone    || '🌻',
        nivel:     t.nivel    || 'Iniciante',
        progresso: t.progresso ?? 0,
        codigo:    t.codigo   || '',
        descricao: t.descricao || '',
        aulasSemana: t.aulasSemana || [],
      }))
    } else {
      let minhasTurmas = []
      try {
        minhasTurmas = await buscarMinhasTurmasAluno()
      } catch (err) {
        console.warn('[SalaDeAula] Erro ao buscar turmas do aluno:', err)
      }

      const mapaProgresso = {}
      if (Array.isArray(minhasTurmas)) {
        minhasTurmas.forEach(mt => {
          if (mt && mt.turmaId) {
            mapaProgresso[String(mt.turmaId)] = mt.progressoPct || 0
          }
        })
      }

      cursos.value = (turmasDoBackend || []).map(t => ({
        id:        t.id,
        titulo:    t.nome || t.titulo || 'Sem título',
        cor:       t.cor      || '#FFD700',
        icone:     t.icone    || '🌻',
        nivel:     t.nivel    || 'Iniciante',
        progresso: mapaProgresso[String(t.id)] ?? (t.progresso ?? 0),
        codigo:    t.codigo   || '',
        descricao: t.descricao || '',
        aulasSemana: t.aulasSemana || [],
      }))
      
      carregarTurmasDesbloqueadas()
    }
  } catch (error) {
    console.error('[SalaDeAula] Erro crítico ao carregar turmas:', error)
    cursos.value = [] 
  } finally {
    carregando.value = false
  }
}

// ─── Navegação ────────────────────────────────────────────────────────────────

function irParaListaAulas(curso) {
  router.push({ name: 'ListaAulasSala', params: { salaId: String(curso.id) } })
}

// ─── Modais ───────────────────────────────────────────────────────────────────

function abrirModalNovaTurma() {
  // Verifica o limite de 16 turmas por professor
  if (cursos.value.length >= 16) {
    toast.error('Limite de Salas alcançado, delete uma turma para criar outra.', { timeout: 4000 })
    return
  }
  
  gerarCodigo()
  mostrarModalNovaTurma.value = true
}
function abrirModalEditarTurma(turma) { turmaEditando.value = { ...turma }; mostrarModalEditarTurma.value = true }

function fecharModalBusca() {
  mostrarModalCodigoTurma.value = false
  tituloBusca.value = ''
  resultadosBusca.value = []
  buscando.value = false
}

function fecharModalInserirCodigo() {
  mostrarModalInserirCodigo.value = false
  codigoTurmaInput.value = ''
  turmaSelecionada.value = null
}

let buscaTimer = null
watch(tituloBusca, () => {
  buscarTurmasPorTituloLocal()
})

async function buscarTurmasPorTituloLocal() {
  clearTimeout(buscaTimer)
  
  if (!tituloBusca.value || tituloBusca.value.trim().length < 2) {
    resultadosBusca.value = []
    buscando.value = false
    return
  }
  
  buscando.value = true
  buscaTimer = setTimeout(async () => {
    try {
      const dadosMapeados = await buscarTurmasPorTitulo(tituloBusca.value.trim())
      resultadosBusca.value = dadosMapeados
    } catch (err) {
      console.error('[SalaDeAula] Erro ao buscar por título:', err)
      resultadosBusca.value = []
    } finally {
      buscando.value = false
    }
  }, 400)
}

// ─── Entrar diretamente numa turma encontrada pela busca ──────────────────────

async function entrarTurmaDireto(turma) {
  turmaSelecionada.value = turma
  codigoTurmaInput.value = ''
  mostrarModalInserirCodigo.value = true
}

// ─── Entrar na turma via código ───────────────────────────────────────────────

async function verificarCodigoEntrar() {
  const codigo = codigoTurmaInput.value?.trim()
  if (!codigo) { toast.error('Por favor, digite o código da turma', { timeout: 1500 }); return }
  try {
    console.log('[SalaDeAula] Código digitado:', codigo.toUpperCase())
    // Primeiro, busca a turma pelo código
    const turma = await buscarTurmaPorCodigo(codigo.toUpperCase())
    console.log('[SalaDeAula] Turma encontrada:', turma)

    if (!turma) {
      toast.error('Erro! Código incorreto. Contatar ao professor!', { timeout: 1500 })
      return
    }

    // Verifica se o código corresponde à turma selecionada (se houver)
    if (turmaSelecionada.value && String(turma.id) !== String(turmaSelecionada.value.id)) {
      toast.error('Erro! Código incorreto. Contatar ao professor!', { timeout: 1500 })
      return
    }

    // Verifica se o aluno já entrou nessa turma (já está desbloqueada)
    if (turmaEstaDesbloqueada(String(turma.id))) {
      toast.warning('Você já entrou nessa aula!', { timeout: 1500 })
      // Ainda redireciona para a lista de aulas
      fecharModalInserirCodigo()
      fecharModalBusca()
      router.push({ name: 'ListaAulasSala', params: { salaId: String(turma.id) } })
      return
    }

    // Desbloqueia a turma para o aluno
    salvarTurmaDesbloqueada(String(turma.id))
    console.log('[SalaDeAula] Turma desbloqueada:', turma.id)

    // Matricula o aluno na turma
    await api.post('/turmas/entrar', { codigo: codigo.toUpperCase() })
    console.log('[SalaDeAula] Aluno matriculado na turma')
    
    toast.success('Código correto, você entrou na aula', { timeout: 1500 })

    // Adiciona a turma à lista de cursos do aluno
    const turmaMapeada = {
      id: turma.id,
      titulo: turma.nome || turma.titulo || 'Sem título',
      cor: turma.cor || '#FFD700',
      icone: turma.icone || '🌻',
      nivel: turma.nivel || 'Iniciante',
      progresso: turma.progresso ?? 0,
      codigo: turma.codigo || '',
      descricao: turma.descricao || '',
      aulasSemana: turma.aulasSemana || [],
    }
    console.log('[SalaDeAula] Turma mapeada:', turmaMapeada)

    // Verifica se a turma já está na lista
    const jaExiste = cursos.value.some(c => String(c.id) === String(turma.id))
    console.log('[SalaDeAula] Turma já existe na lista?', jaExiste)
    if (!jaExiste) {
      cursos.value.push(turmaMapeada)
      console.log('[SalaDeAula] Turma adicionada à lista. Cursos atuais:', cursos.value)
    }

    fecharModalInserirCodigo()
    fecharModalBusca()

    // Redireciona para a lista de aulas da turma
    router.push({ name: 'ListaAulasSala', params: { salaId: String(turma.id) } })
  } catch (error) {
    console.error('[SalaDeAula] Erro ao entrar na turma:', error)
    toast.error('Erro! Código incorreto. Contatar ao professor!', { timeout: 1500 })
  }
}

// ─── Criar turma + aula (professor) ──────────────────────────────────────────

function gerarCodigo() {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', N = '0123456789'
  let c = ''
  for (let i = 0; i < 3; i++) c += L[Math.floor(Math.random() * L.length)]
  for (let i = 0; i < 2; i++) c += N[Math.floor(Math.random() * N.length)]
  novaTurma.value.codigo = c
}

async function criarTurma() {
  if (!novaTurma.value.titulo) { alert('Por favor, preencha o nome da turma'); return }
  try {
    const turmaSalva = await salvarTurma({
      titulo: novaTurma.value.titulo, codigo: novaTurma.value.codigo,
      nivel:  novaTurma.value.nivel,  cor:    novaTurma.value.cor,
      icone:  novaTurma.value.icone,  descricao: '',
    })
    turmaTemp.value = turmaSalva
    etapa.value = 'aula'
  } catch (error) {
    console.error('[SalaDeAula] Erro ao criar turma:', error)
    alert('Erro ao criar turma. Tente novamente.')
  }
}

async function criarAula() {
  if (!novaAula.value.titulo) { alert('Por favor, preencha o tema da aula'); return }
  const pdfsGrandes = novaAula.value.pdfs.filter(f => f.size > 700 * 1024)
  if (pdfsGrandes.length) {
    alert(`PDFs muito grandes (máx 700KB): ${pdfsGrandes.map(f => f.name).join(', ')}`)
    return
  }
  const topicos = novaAula.value.topicosTexto
    ? novaAula.value.topicosTexto.split(',').map(t => t.trim()).filter(Boolean)
    : []
  try {
    const aulaSalva = await salvarAula({
      turmaId: turmaTemp.value.id, turmaCodigo: turmaTemp.value.codigo,
      titulo: novaAula.value.titulo,            dataLancamento: novaAula.value.dataLancamento,
      liberado: novaAula.value.liberado,         videoId: extrairVideoId(novaAula.value.videoId),
      descricao: novaAula.value.descricao,       topicos, ordem: 0,
    })
    for (const arq of novaAula.value.pdfs) {
      try { await uploadPdf(turmaTemp.value.id, aulaSalva.id, arq) }
      catch (e) { alert(`PDF "${arq.name}" não enviado: ${e.message}`) }
    }
    await recarregarCursos()
    mostrarModalNovaTurma.value = false
    etapa.value = 'turma'
    novaTurma.value = { titulo: '', codigo: '', cor: '#FFD700', icone: '🌻', nivel: 'Iniciante' }
    novaAula.value  = { titulo: '', dataLancamento: '', liberado: true, videoId: '', descricao: '', topicosTexto: '', topicos: [], pdfs: [] }
    turmaTemp.value = null
  } catch (error) {
    console.error('[SalaDeAula] Erro ao criar aula:', error)
    alert('Erro ao criar aula. Tente novamente.')
  }
}

// ─── Editar / excluir turma ───────────────────────────────────────────────────

async function salvarEdicaoTurma() {
  if (!turmaEditando.value?.titulo) { alert('Por favor, preencha o nome da turma'); return }
  try {
    await atualizarTurma(turmaEditando.value.id, {
      titulo: turmaEditando.value.titulo,   descricao: turmaEditando.value.descricao,
      cor:    turmaEditando.value.cor,      icone:     turmaEditando.value.icone,
      nivel:  turmaEditando.value.nivel,    codigo:    turmaEditando.value.codigo,
    })
    const idx = cursos.value.findIndex(c => c.id === turmaEditando.value.id)
    if (idx > -1) cursos.value[idx] = { ...turmaEditando.value }
    mostrarModalEditarTurma.value = false
    turmaEditando.value = null
  } catch (error) {
    console.error('[SalaDeAula] Erro ao editar:', error)
    alert('Erro ao salvar edição. Tente novamente.')
  }
}

async function excluirTurma(id) {
  if (!confirm('Tem certeza que deseja excluir esta turma?')) return
  try {
    await deletarTurmaApi(id)
    cursos.value = cursos.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('[SalaDeAula] Erro ao excluir:', error)
    alert('Erro ao excluir turma. Tente novamente.')
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extrairVideoId(url) {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  return m ? m[1] : url
}

function handlePdfUpload(event) {
  novaAula.value.pdfs = Array.from(event.target.files)
}
</script>

<style scoped>
/* CSS NATIVO ANTI-BUG DE REFRESH: Aplica a imagem imediatamente via Media Queries do navegador */
.bg-fundo-default {
  background-color: #380075;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

@media (max-width: 639px) {
  .bg-fundo-default {
    background-image: url('/img/fundo2.jpg');
    background-size: cover;
    background-position: center;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .bg-fundo-default {
    background-image: url('/img/fundo.png');
    background-size: cover;
    background-position: center;
  }
}

@media (min-width: 1024px) {
  .bg-fundo-default {
    background-image: url('/img/fundo.png');
    background-size: cover;
    background-position: center;
  }
}
</style>