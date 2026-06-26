<template>
  <div class="w-full h-full flex flex-col items-center py-4 px-3 pb-12 overflow-y-auto font-['Quicksand'] hide-scrollbar relative bg-[#380075]">
    <!-- Abstract shapes -->
    <div class="absolute top-20 left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <!-- Purple circles -->
    <div class="absolute -top-20 -left-10 w-40 h-40 sm:w-90 sm:h-90 rounded-full opacity-40 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-20 right-10 w-32 h-32 sm:top-40 sm:right-32 sm:w-70 sm:h-70 rounded-full opacity-35 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 sm:bottom-48 sm:left-40 sm:w-50 sm:h-50 rounded-full opacity-18 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-32 right-10 w-20 h-20 sm:bottom-32 sm:right-40 sm:w-44 sm:h-44 rounded-full opacity-15 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-60 left-5 w-8 h-8 sm:top-80 sm:left-16 sm:w-9 sm:h-9 rounded-full opacity-12 z-0" style=" background-color: #7a3cae;"></div>
    <BackButton
      button-class="fixed top-5 left-4 z-[1000] w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.push({ name: 'SalaDeAula' })"
    />

    <button
      v-if="isProfessor && curso && turmaDoBackend"
      type="button"
      @click="abrirModalNovaAula"
      class="fixed top-5 right-4 z-[1000] w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"
      title="Adicionar aula"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    </button>
    <!-- Loading state -->
    <div v-if="carregando" class="flex flex-col items-center justify-center h-screen w-full gap-4 absolute inset-0">
      <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-white/60 text-sm">Carregando suas aulas...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="erroCarregamento" class="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
      <p class="text-white text-lg font-semibold">Ops, parece que temos um problema no servidor, tente novamente mais tarde!</p>
      <button
        type="button"
        @click="recarregarAulas"
        class="mt-4 bg-cyan-400 text-[#420583] font-bold py-2 px-6 rounded-full hover:bg-cyan-300 transition-colors text-sm"
      >
        Tentar novamente
      </button>
    </div>

    <template v-else-if="curso">
      <header class="w-full max-w-md mt-10 mb-4 shrink-0 px-1">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 text-center relative top-5">
            <h1 class="text-white font-bold text-xl md:text-2xl leading-tight">{{ curso.titulo }}</h1>
            <div class="mt-4">
              <p class="text-cyan-300/90 text-xs font-semibold tracking-wide uppercase">Aulas da semana</p>
            </div>
          </div>
        </div>
      </header>

      <section class="w-full max-w-[92%] flex flex-col gap-3 px-1 mt-8 relative top-8">
        <article
          v-for="aula in curso.aulasSemana"
          :key="aula.id"
          class="bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-6"
        >
          <div class="flex items-start gap-2">
            <div class="min-w-0 flex-1 relative left-2 top-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h2 class="text-[#420583] font-bold text-base leading-snug">{{ aula.titulo }}</h2>
                <div class="shrink-0"><IconLock :liberado="aula.liberado" /></div>
              </div>
              <p class="text-gray-500 text-xs mt-1">Publicada em {{ formatarData(aula.dataLancamento) }}</p>
            </div>
          </div>
          <div class="flex justify-center items-center gap-2 pr-0 relative bottom-2">
            <button
              v-if="isProfessor"
              type="button"
              @click="excluirAula(aula.id)"
              class="font-bold py-1.5 px-4 rounded-full transition-colors min-w-[70px] text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Remover
            </button>
            <button
              v-if="isProfessor"
              type="button"
              @click="abrirModalEditarAula(aula)"
              class="font-bold py-1.5 px-4 rounded-full transition-colors min-w-[70px] text-sm bg-cyan-400 text-[#420583] hover:bg-cyan-300"
            >
              Editar
            </button>
            <button
              type="button"
              :disabled="!aula.liberado"
              @click="acessarAula(aula)"
              class="font-bold py-1.5 px-6 rounded-full transition-colors min-w-[70px] text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Acessar
            </button>
          </div>
        </article>
      </section>
    </template>

    <section v-else class="mt-24 text-center text-white max-w-xs px-4">
      <p class="text-xl sm:text-2xl font-bold mb-2 mt-4 text-center relative top-5">Sala não encontrada</p>
      
    </section>

    

    <SalaBottomNav />

    <!-- Modal Nova Aula (cadastro avulso) -->
    <div v-if="mostrarModalNovaAula" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4" @click.self="mostrarModalNovaAula = false">
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-xl text-white text-center">Adicionar Aula</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Tema da Aula</label>
            <input v-model="novaAula.titulo" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Digite o tema da aula">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Data de Publicação (dd/mm/aaaa)</label>
            <input v-model="novaAula.dataLancamento" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="dd/mm/aaaa">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Aula Liberada?</label>
            <div class="flex gap-4">
              <button type="button" @click="novaAula.liberado = true" class="flex-1 py-3 rounded-xl font-semibold transition-all" :class="novaAula.liberado ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'">Sim</button>
              <button type="button" @click="novaAula.liberado = false" class="flex-1 py-3 rounded-xl font-semibold transition-all" :class="!novaAula.liberado ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'">Não</button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Link do YouTube</label>
            <input v-model="novaAula.videoId" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Cole o link do YouTube">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Descrição</label>
            <textarea v-model="novaAula.descricao" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none" placeholder="O que você vai aprender nessa aula"></textarea>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Tópicos (separados por vírgula)</label>
            <textarea v-model="novaAula.topicosTexto" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none" placeholder="Tópico 1, Tópico 2, Tópico 3"></textarea>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Material Complementar (PDFs — máx. 700KB cada)</label>
            <input type="file" accept=".pdf,application/pdf" multiple @change="handlePdfUpload" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-[#420583] hover:file:bg-cyan-300">
            <div v-if="novaAula.pdfs.length > 0" class="mt-2 flex flex-col gap-1">
              <div v-for="(pdf, i) in novaAula.pdfs" :key="i" class="text-white/60 text-xs flex items-center gap-2">
                <span>📄 {{ pdf.name }}</span>
                <span :class="pdf.size > MAX_PDF_BYTES ? 'text-red-400' : 'text-green-400'">
                  {{ pdf.size > MAX_PDF_BYTES ? '⚠ Muito grande' : '✓' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button type="button" @click="mostrarModalNovaAula = false" class="flex-1 py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Cancelar</button>
          <button type="button" @click="criarAulaAvulsa" class="flex-1 py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Criar Aula</button>
        </div>
      </div>
    </div>

    <!-- Modal Editar Aula -->
    <div v-if="mostrarModalEditarAula && aulaEditando" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4" @click.self="mostrarModalEditarAula = false">
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-[85%] max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-xl text-white text-center">Editar Aula</h3>
        
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-white/80 text-2 block relative-2 block relative left-6">Tema da Aula</label>
            <input v-model="aulaEditando.titulo" type="text" class="w-[90%] relative left-3 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Digite o tema da aula ">
          </div>
          
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Data de Publicação (dd/mm/aaaa)</label>
            <input v-model="aulaEditando.dataLancamento" type="text" class="w-[90%] relative left-3 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="dd/mm/aaaa">
          </div>
          
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Aula Liberada?</label>
            <div class="flex gap-4">
              <button @click="aulaEditando.liberado = true" class="py-3 rounded-xl font-semibold transition-all relative left-4 w-[40%]" :class="aulaEditando.liberado ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'">Sim</button>
              <button @click="aulaEditando.liberado = false" class="  py-3 rounded-xl font-semibold transition-all relative -right-4 w-[45%] relative" :class="!aulaEditando.liberado ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'">Não</button>
            </div>
          </div>
          
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Link do YouTube</label>
            <input v-model="aulaEditando.videoId" type="text" class="w-[90%] relative left-3 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Cole o link do YouTube">
          </div>
          
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Descrição</label>
            <textarea v-model="aulaEditando.descricao" class="w-[90%] relative left-3 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none" placeholder="O que você vai aprender nessa aula"></textarea>
          </div>
          
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6">Tópicos (separados por vírgula)</label>
            <textarea v-model="aulaEditando.topicosTexto" class=" w-[90%] relative  left-3 bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none" placeholder="Tópico 1, Tópico 2, Tópico 3"></textarea>
          </div>
 <div class="relative left-0 -top-[0.5rem] w-[100%]">
            
            <label class="text-white/80 text-sm font-semibold mb-2 block relative left-6 -top-[0rem]">Adicionar PDFs (máx. 700KB cada)</label>
            <input type="file" accept=".pdf,application/pdf" multiple @change="handlePdfUploadEdicao" class="w-[90%] relative left-3 bg-white/10 border border-white/15 rounded-2xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-[#420583] hover:file:bg-cyan-300">
            <div v-if="aulaEditando.pdfsNovos?.length" class="mt-2 flex flex-col gap-1 relative left-3 ">
              <div v-for="(pdf, i) in aulaEditando.pdfsNovos" :key="i" class="text-white/60 text-xs flex items-center gap-2">
                <span>📄 {{ pdf.name }}</span>
                <span :class="pdf.size > MAX_PDF_BYTES ? 'text-red-400' : 'text-green-400'">
                  {{ pdf.size > MAX_PDF_BYTES ? '⚠ Muito grande' : '✓' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button @click="mostrarModalEditarAula = false; aulaEditando = null" class=" relative left-3 w-[43%] -top-[0.5rem] py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Cancelar</button>
          <button @click="salvarEdicaoAula" class=" relative left-3  w-[44%] border -top-[0.5rem] py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import IconLock from '../../components/ui/IconLock.vue'
import FooterAnjos from '../../components/sala/FooterAnjos.vue'
import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'
import { formatarData } from '../../composables/formatarData.js'
import { useAuthStore } from '../../stores/auth.js'
import {
  buscarAulasPorTurmaId, buscarTurmaPorId, atualizarAula,
  excluirAula as deletarAulaApi, salvarAulaNaTurma, uploadPdf, mapearTurmaParaCard,
  buscarProgressoAula, zerarProgressoProfessor as zerarProgressoProfessorApi,
} from '../../services/firebase.js'

const MAX_PDF_BYTES = 700 * 1024

const props = defineProps({
  salaId: { type: [String, Number], required: true },
})

const router = useRouter()
const authStore = useAuthStore()
const curso = ref(null)
const turmaDoBackend = ref(false)
const carregando = ref(true)
const erroCarregamento = ref(false)
const isProfessor = computed(() => authStore.usuario?.role === 'professor')
const mostrarModalEditarAula = ref(false)
const mostrarModalNovaAula = ref(false)
const aulaEditando = ref(null)
const novaAula = ref({
  titulo: '', dataLancamento: '', liberado: true, videoId: '',
  descricao: '', topicosTexto: '', pdfs: [],
})



async function carregarAulas() {
  carregando.value = true
  erroCarregamento.value = false

  try {
    const turma = await buscarTurmaPorId(String(props.salaId))
    
    if (turma) {
      turmaDoBackend.value = true
      const aulas = await buscarAulasPorTurmaId(String(props.salaId))
      
      const aulasComProgresso = await Promise.all(
        aulas.map(async (a) => {
          const progresso = { videoAssistido: false, pdfVisualizado: false, pdfBaixado: false, progresso: 0 }
          return {
            ...a,
            videoId: extrairVideoIdDeLink(a.link || ''),
            liberado: a.liberado ?? true,
            topicos: Array.isArray(a.topicos) ? a.topicos : [],
            dataLancamento: a.dataLancamento || '',
            descricao: a.descricao || '',
            progressoAula: progresso
          }
        })
      )
      
      curso.value = {
        ...mapearTurmaParaCard(turma),
        aulasSemana: aulasComProgresso
      }
    } else {
      erroCarregamento.value = true
    }
  } catch (error) {
    console.error('Erro ao buscar turma no backend:', error)
    erroCarregamento.value = true
  } finally {
    await new Promise(resolve => setTimeout(resolve, 1500))
    carregando.value = false
  }
}


function recarregarAulas() {
  carregarAulas()
}

onMounted(async () => {
  await carregarAulas()
})

function extrairVideoIdDeLink(link) {
  if (!link) return 'dQw4w9WgXcQ'
  const match = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : 'dQw4w9WgXcQ'
}

function extrairVideoId(url) {
  if (!url) return 'dQw4w9WgXcQ'
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : 'dQw4w9WgXcQ'
}

function acessarAula(aula) {
  if (!curso.value || !aula.liberado) return
  const c = curso.value
  const desc = aula.descricao != null && aula.descricao !== '' ? aula.descricao : (c.descricao || '')

  router.push({
    name: 'Aula',
    params: {
      id: `${c.id}-${aula.id}`,
      titulo: aula.titulo,
      nivel: c.nivel || 'Básico',
      progresso: String(aula.progresso ?? c.progresso ?? 0),
      videoId: aula.videoId || c.videoId || 'dQw4w9WgXcQ',
    },
    query: {
      desc: encodeURIComponent(desc),
      topicos: encodeURIComponent(JSON.stringify(aula.topicos || [])),
      turmaId: String(c.id),
      conteudoId: String(aula.id),
    },
  })
}

function abrirModalNovaAula() {
  novaAula.value = {
    titulo: '', dataLancamento: '', liberado: true, videoId: '',
    descricao: '', topicosTexto: '', pdfs: [],
  }
  mostrarModalNovaAula.value = true
}

function handlePdfUpload(event) {
  novaAula.value.pdfs = Array.from(event.target.files || [])
}

async function criarAulaAvulsa() {
  if (!novaAula.value.titulo?.trim()) {
    alert('Por favor, preencha o tema da aula')
    return
  }
  if (!novaAula.value.videoId?.trim()) {
    alert('Por favor, informe o link do YouTube')
    return
  }
  const pdfsGrandes = novaAula.value.pdfs.filter(f => f.size > MAX_PDF_BYTES)
  if (pdfsGrandes.length > 0) {
    alert(`Os seguintes PDFs são muito grandes (máx. 700KB): ${pdfsGrandes.map(f => f.name).join(', ')}`)
    return
  }
  const topicosArray = novaAula.value.topicosTexto
    ? novaAula.value.topicosTexto.split(',').map(t => t.trim()).filter(Boolean)
    : []
  try {
    const aulaSalva = await salvarAulaNaTurma(String(props.salaId), {
      titulo: novaAula.value.titulo,
      descricao: novaAula.value.descricao,
      videoId: extrairVideoId(novaAula.value.videoId),
      topicos: topicosArray,
      liberado: novaAula.value.liberado,
      dataLancamento: novaAula.value.dataLancamento,
      ordem: curso.value?.aulasSemana?.length ?? 0,
    })
    if (novaAula.value.pdfs.length > 0 && aulaSalva.id) {
      for (const arquivo of novaAula.value.pdfs) {
        try {
          await uploadPdf(String(props.salaId), aulaSalva.id, arquivo)
        } catch (erroPdf) {
          console.error(`Erro ao enviar PDF "${arquivo.name}":`, erroPdf)
          alert(`PDF "${arquivo.name}" não pôde ser enviado: ${erroPdf.message}`)
        }
      }
    }
    const videoIdExtraido = extrairVideoId(novaAula.value.videoId)
    curso.value.aulasSemana.push({
      id: aulaSalva.id,
      titulo: novaAula.value.titulo,
      dataLancamento: novaAula.value.dataLancamento,
      liberado: novaAula.value.liberado,
      videoId: videoIdExtraido,
      descricao: novaAula.value.descricao,
      topicos: topicosArray,
      pdfs: [],
    })
    mostrarModalNovaAula.value = false
  } catch (error) {
    console.error('Erro ao criar aula:', error)
    alert(error.message || 'Erro ao criar aula. Tente novamente.')
  }
}

function handlePdfUploadEdicao(event) {
  if (!aulaEditando.value) return
  aulaEditando.value.pdfsNovos = Array.from(event.target.files || [])
}

function abrirModalEditarAula(aula) {
  aulaEditando.value = {
    ...aula,
    topicosTexto: aula.topicos ? aula.topicos.join(', ') : '',
    pdfsNovos: [],
  }
  mostrarModalEditarAula.value = true
}

async function excluirAula(id) {
  if (confirm('Tem certeza que deseja excluir esta aula?')) {
    try {
      await deletarAulaApi(String(props.salaId), id)
      curso.value.aulasSemana = curso.value.aulasSemana.filter(a => a.id !== id)
    } catch (error) {
      console.error('Erro ao excluir aula:', error)
      alert('Erro ao excluir aula. Tente novamente.')
    }
  }
}

async function salvarEdicaoAula() {
  if (!aulaEditando.value.titulo) {
    alert('Por favor, preencha o tema da aula')
    return
  }
  const topicosArray = aulaEditando.value.topicosTexto
    ? aulaEditando.value.topicosTexto.split(',').map(t => t.trim()).filter(t => t)
    : []
  const videoIdExtraido = extrairVideoId(aulaEditando.value.videoId)
  try {
    await atualizarAula(String(props.salaId), aulaEditando.value.id, {
      titulo: aulaEditando.value.titulo,
      descricao: aulaEditando.value.descricao,
      link: `https://www.youtube.com/watch?v=${videoIdExtraido}`,
      liberado: aulaEditando.value.liberado,
      topicos: topicosArray,
      dataLancamento: aulaEditando.value.dataLancamento,
    })

    const pdfsNovos = aulaEditando.value.pdfsNovos || []
    for (const arquivo of pdfsNovos) {
      if (arquivo.size > MAX_PDF_BYTES) {
        alert(`PDF "${arquivo.name}" excede 700KB e foi ignorado.`)
        continue
      }
      try {
        await uploadPdf(String(props.salaId), aulaEditando.value.id, arquivo)
      } catch (erroPdf) {
        console.error(`Erro ao enviar PDF "${arquivo.name}":`, erroPdf)
        alert(`PDF "${arquivo.name}" não pôde ser enviado: ${erroPdf.message}`)
      }
    }
    const index = curso.value.aulasSemana.findIndex(a => a.id === aulaEditando.value.id)
    if (index > -1) {
      curso.value.aulasSemana[index] = {
        ...aulaEditando.value,
        topicos: topicosArray,
        videoId: videoIdExtraido,
        descricao: aulaEditando.value.descricao // <- atualiza localmente também
      }
    }
    mostrarModalEditarAula.value = false
    aulaEditando.value = null
  } catch (error) {
    console.error('Erro ao editar aula:', error)
    alert('Erro ao salvar edição. Tente novamente.')
  }
}

function textoBotaoAula(aula) {
  const progresso = aula.progressoAula?.progresso || 0
  if (progresso === 0) return 'Acessar'
  if (progresso >= 100) return 'Rever'
  return 'Continuar'
}

</script>

<style scoped>
@media (max-width: 480px) {
  .min-h-screen {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>