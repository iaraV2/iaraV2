<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-6 overflow-y-auto font-['Quicksand'] hide-scrollbar">
    <BackButton
      button-class="fixed top-8 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.push('/menu')"
    />

    <div class="w-full text-center mt-16 mb-8 shrink-0 relative">
      <button v-if="isProfessor" @click="abrirModalNovaTurma" class="fixed top-8 right-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
      <h1 class="text-cyan-400 font-light text-2xl md:text-3xl leading-tight relative top-5">Bem-Vindo à</h1>
      <h1 class="text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-5">Sala de aula</h1>
    </div>

    <div class="w-full flex-grow flex items-center justify-center">
      <div class="w-full max-w-6xl">
        <div class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center sm:mt-0 mt-40 relative top-10">
          <div
            v-for="c in cursos"
            :key="c.id"
            class="bg-white rounded-[30px] flex flex-col items-center text-center transition-transform group relative overflow-hidden shadow-xl pb-11 w-full max-w-[300px] sm:max-w-none h-[220px]"
          >
            <button v-if="isProfessor" @click="excluirTurma(c.id)" class="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-red-500/90 backdrop-blur-md rounded-full text-white cursor-pointer transition-all duration-300 hover:bg-red-600 hover:scale-110 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
            <button v-if="isProfessor" @click="abrirModalEditarTurma(c)" class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-cyan-400/90 backdrop-blur-md rounded-full text-[#420583] cursor-pointer transition-all duration-300 hover:bg-cyan-300 hover:scale-110 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </button>
            <div class="w-full h-24 flex items-center justify-center mb-4 shadow-sm" :style="{ backgroundColor: c.cor }">
              <span class="text-5xl drop-shadow-md">{{ c.icone }}</span>
            </div>
            <div class="px-6 flex flex-col items-center flex-grow">
              <h3 class="text-[#420583] font-bold text-xl mb-2 leading-tight">{{ c.titulo }}</h3>
              <p class="text-gray-600 text-sm mb-1">Nível: {{ c.nivel }}</p>
              <div class="text-2xl font-bold text-[#420583] mb-4">{{ c.progresso }}%</div>
              <button
                @click="irParaListaAulas(c)"
                class="mt-auto bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105 active:scale-95 w-full max-w-[200px] cursor-pointer"
              >
                {{ c.progresso === 100 ? 'Rever' : c.progresso === 0 ? 'Acessar' : 'Continuar' }}
              </button>
            </div>
            <div class="absolute bottom-0 left-0 h-2 bg-green-500 transition-all duration-500" :style="{ width: c.progresso + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-24 shrink-0"></div>
    <FooterAnjos wrapper-class="mt-12 mb-6 shrink-0" img-class="w-32 opacity-70" />

    <!-- Modal Nova Turma -->
    <div v-if="mostrarModalNovaTurma" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4" @click.self="mostrarModalNovaTurma = false">
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-xl text-white text-center">{{ etapa === 'turma' ? 'Criar Nova Turma' : 'Adicionar Aula' }}</h3>

        <div v-if="etapa === 'turma'" class="flex flex-col gap-4">
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Nome da Turma</label>
            <input v-model="novaTurma.titulo" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Digite o nome da turma">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Código da Turma</label>
            <div class="flex gap-2">
              <input v-model="novaTurma.codigo" type="text" readonly class="flex-1 bg-white/5 border border-white/15 rounded-xl p-3 text-cyan-400 font-bold tracking-wider focus:outline-none" placeholder="Código gerado automaticamente">
              <button @click="gerarCodigo" class="px-4 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">🔄</button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Cor da Sala</label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="cor in cores" :key="cor" @click="novaTurma.cor = cor" class="w-10 h-10 rounded-full border-2 transition-all" :class="novaTurma.cor === cor ? 'border-white scale-110' : 'border-transparent hover:scale-105'" :style="{ backgroundColor: cor }"></button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Emoji</label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="emoji in emojis" :key="emoji" @click="novaTurma.icone = emoji" class="w-10 h-10 rounded-xl bg-white/10 border-2 text-2xl transition-all hover:bg-white/20" :class="novaTurma.icone === emoji ? 'border-cyan-400 bg-cyan-400/30 scale-110' : 'border-white/15'">{{ emoji }}</button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Nível</label>
            <select v-model="novaTurma.nivel" class="w-full bg-[#420583] border border-cyan-400 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400">
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Essencial">Essencial</option>
              <option value="Criativo">Criativo</option>
              <option value="Básico">Básico</option>
            </select>
          </div>
        </div>

        <div v-if="etapa === 'aula'" class="flex flex-col gap-4">
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
              <button @click="novaAula.liberado = true" class="flex-1 py-3 rounded-xl font-semibold transition-all" :class="novaAula.liberado ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'">Sim</button>
              <button @click="novaAula.liberado = false" class="flex-1 py-3 rounded-xl font-semibold transition-all" :class="!novaAula.liberado ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60'">Não</button>
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
            <input type="file" accept=".pdf" multiple @change="handlePdfUpload" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-[#420583] hover:file:bg-cyan-300">
            <div v-if="novaAula.pdfs.length > 0" class="mt-2 flex flex-col gap-1">
              <div v-for="(pdf, i) in novaAula.pdfs" :key="i" class="text-white/60 text-xs flex items-center gap-2">
                <span>📄 {{ pdf.name }}</span>
                <span :class="pdf.size > 700 * 1024 ? 'text-red-400' : 'text-green-400'">
                  {{ pdf.size > 700 * 1024 ? '⚠ Muito grande' : '✓' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button v-if="etapa === 'turma'" @click="mostrarModalNovaTurma = false" class="flex-1 py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Cancelar</button>
          <button v-if="etapa === 'aula'" @click="etapa = 'turma'" class="flex-1 py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Voltar</button>
          <button v-if="etapa === 'turma'" @click="criarTurma" class="flex-1 py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Próximo</button>
          <button v-if="etapa === 'aula'" @click="criarAula" class="flex-1 py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Criar Aula</button>
        </div>
      </div>
    </div>

    <!-- Modal Editar Turma -->
    <div v-if="mostrarModalEditarTurma && turmaEditando" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4" @click.self="mostrarModalEditarTurma = false">
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <h3 class="font-bold text-xl text-white text-center">Editar Turma</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Nome da Turma</label>
            <input v-model="turmaEditando.titulo" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400" placeholder="Digite o nome da turma">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Código da Turma</label>
            <input v-model="turmaEditando.codigo" type="text" readonly class="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-cyan-400 font-bold tracking-wider focus:outline-none">
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Cor da Sala</label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="cor in cores" :key="cor" @click="turmaEditando.cor = cor" class="w-10 h-10 rounded-full border-2 transition-all" :class="turmaEditando.cor === cor ? 'border-white scale-110' : 'border-transparent hover:scale-105'" :style="{ backgroundColor: cor }"></button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Emoji</label>
            <div class="flex gap-2 flex-wrap">
              <button v-for="emoji in emojis" :key="emoji" @click="turmaEditando.icone = emoji" class="w-10 h-10 rounded-xl bg-white/10 border-2 text-2xl transition-all hover:bg-white/20" :class="turmaEditando.icone === emoji ? 'border-cyan-400 bg-cyan-400/30 scale-110' : 'border-white/15'">{{ emoji }}</button>
            </div>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Nível</label>
            <select v-model="turmaEditando.nivel" class="w-full bg-[#420583] border border-cyan-400 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400">
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Essencial">Essencial</option>
              <option value="Criativo">Criativo</option>
              <option value="Básico">Básico</option>
            </select>
          </div>
          <div>
            <label class="text-white/80 text-sm font-semibold mb-2 block">Descrição</label>
            <textarea v-model="turmaEditando.descricao" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 h-20 resize-none" placeholder="Descrição da turma"></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="mostrarModalEditarTurma = false; turmaEditando = null" class="flex-1 py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Cancelar</button>
          <button @click="salvarEdicaoTurma" class="flex-1 py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Salvar</button>
        </div>
      </div>
    </div>

    <!-- Modal Código da Turma -->
    <div v-if="mostrarModalCodigoTurma" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4" @click.self="mostrarModalCodigoTurma = false">
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
        <h3 class="font-bold text-xl text-white text-center">Acessar Turma</h3>
        <p class="text-white/70 text-sm text-center">Digite o código da turma para acessar as aulas</p>
        <div>
          <label class="text-white/80 text-sm font-semibold mb-2 block">Código da Turma</label>
          <input v-model="codigoTurmaInput" type="text" class="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 uppercase font-bold tracking-wider" placeholder="Ex: ABC12" maxlength="5">
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="mostrarModalCodigoTurma = false; codigoTurmaInput = ''" class="flex-1 py-3 bg-white/10 border border-white/15 rounded-xl font-semibold text-white hover:bg-white/20 transition-all">Cancelar</button>
          <button @click="acessarTurmaPorCodigo" class="flex-1 py-3 bg-cyan-400 rounded-xl font-bold text-[#420583] hover:bg-cyan-300 transition-all">Acessar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import FooterAnjos from '../../components/sala/FooterAnjos.vue'
import { cursos as cursosSalas } from './salasCurso.js'
import {
  buscarTurmaPorCodigo, buscarTodasTurmas, salvarTurma, salvarAula,
  atualizarTurma, excluirTurma as deletarTurmaApi, uploadPdf
} from '../../services/firebase.js'

const router = useRouter()
const cursos = ref([...cursosSalas])
const isProfessor = ref(true)
const mostrarModalNovaTurma = ref(false)
const mostrarModalEditarTurma = ref(false)
const mostrarModalCodigoTurma = ref(false)
const etapa = ref('turma')
const turmaTemp = ref(null)
const turmaEditando = ref(null)
const codigoTurmaInput = ref('')

const cores = ['#FFD700', '#25D366', '#C13584', '#2A52BE', '#00C4CC', '#85bb65', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
const emojis = ['🌻', '📱', '📸', '🛡️', '🎨', '💰', '🚀', '💡', '🎯', '📚', '🎓', '💻', '🌟', '🔥', '⭐', '🎵', '🎬', '🎮', '🏆', '💎', '🌈', '☀️', '🌙', '🍎', '🍕', '🚗', '✈️', '🏠', '🌺', '🦋', '🐱', '🐶']

const novaTurma = ref({ titulo: '', codigo: '', cor: '#FFD700', icone: '🌻', nivel: 'Iniciante' })
const novaAula = ref({ titulo: '', dataLancamento: '', liberado: true, videoId: '', descricao: '', topicosTexto: '', topicos: [], pdfs: [] })

onMounted(async () => {
  try {
    const turmasDoBackend = await buscarTodasTurmas()
    const turmasMapeadas = turmasDoBackend.map(t => ({
      ...t, titulo: t.nome || t.titulo, progresso: t.progresso || 0,
      cor: t.cor || '#FFD700', icone: t.icone || '🌻', nivel: t.nivel || 'Iniciante', aulasSemana: []
    }))
    const idsBanco = turmasMapeadas.map(t => t.id)
    const estaticasFiltradas = cursosSalas.filter(c => !idsBanco.includes(c.id))
    cursos.value = [...estaticasFiltradas, ...turmasMapeadas]
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
    cursos.value = [...cursosSalas]
  }
})

const irParaListaAulas = (curso) => {
  router.push({ name: 'ListaAulasSala', params: { salaId: String(curso.id) } })
}

function abrirModalNovaTurma() { gerarCodigo(); mostrarModalNovaTurma.value = true }
function abrirModalEditarTurma(turma) { turmaEditando.value = { ...turma }; mostrarModalEditarTurma.value = true }

async function excluirTurma(id) {
  if (confirm('Tem certeza que deseja excluir esta turma?')) {
    try {
      await deletarTurmaApi(id)
      cursos.value = cursos.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Erro ao excluir turma:', error)
      alert('Erro ao excluir turma. Tente novamente.')
    }
  }
}

async function salvarEdicaoTurma() {
  if (!turmaEditando.value.titulo) { alert('Por favor, preencha o nome da turma'); return }
  try {
    await atualizarTurma(turmaEditando.value.id, {
      titulo: turmaEditando.value.titulo, descricao: turmaEditando.value.descricao
    })
    const index = cursos.value.findIndex(c => c.id === turmaEditando.value.id)
    if (index > -1) cursos.value[index] = { ...turmaEditando.value }
    mostrarModalEditarTurma.value = false
    turmaEditando.value = null
  } catch (error) {
    console.error('Erro ao editar turma:', error)
    alert('Erro ao salvar edição. Tente novamente.')
  }
}

async function acessarTurmaPorCodigo() {
  if (!codigoTurmaInput.value) { alert('Por favor, digite o código da turma'); return }
  try {
    const turma = await buscarTurmaPorCodigo(codigoTurmaInput.value.toUpperCase())
    if (!turma) { alert('Código da turma não encontrado'); return }
    localStorage.setItem('turma_codigo', turma.codigo)
    localStorage.setItem('turma_id', turma.id)
    mostrarModalCodigoTurma.value = false
    codigoTurmaInput.value = ''
    router.push({ name: 'ListaAulasSala', params: { salaId: String(turma.id) } })
  } catch (error) {
    console.error('Erro ao acessar turma:', error)
    alert('Erro ao acessar turma. Tente novamente.')
  }
}

function extrairVideoId(url) {
  if (!url) return 'dQw4w9WgXcQ'
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : 'dQw4w9WgXcQ'
}

function handlePdfUpload(event) {
  novaAula.value.pdfs = Array.from(event.target.files)
}

function gerarCodigo() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numeros = '0123456789'
  let codigo = ''
  for (let i = 0; i < 3; i++) codigo += letras.charAt(Math.floor(Math.random() * letras.length))
  for (let i = 0; i < 2; i++) codigo += numeros.charAt(Math.floor(Math.random() * numeros.length))
  novaTurma.value.codigo = codigo
}

async function criarTurma() {
  if (!novaTurma.value.titulo) { alert('Por favor, preencha o nome da turma'); return }
  try {
    const turmaSalva = await salvarTurma({
      titulo: novaTurma.value.titulo, codigo: novaTurma.value.codigo,
      nivel: novaTurma.value.nivel, cor: novaTurma.value.cor,
      icone: novaTurma.value.icone, descricao: ''
    })
    turmaTemp.value = turmaSalva
    etapa.value = 'aula'
  } catch (error) {
    console.error('Erro ao criar turma:', error)
    alert('Erro ao criar turma. Tente novamente.')
  }
}

async function criarAula() {
  if (!novaAula.value.titulo) { alert('Por favor, preencha o tema da aula'); return }

  const pdfsGrandes = novaAula.value.pdfs.filter(f => f.size > 700 * 1024)
  if (pdfsGrandes.length > 0) {
    alert(`Os seguintes PDFs são muito grandes (máx. 700KB): ${pdfsGrandes.map(f => f.name).join(', ')}`)
    return
  }

  const topicosArray = novaAula.value.topicosTexto
    ? novaAula.value.topicosTexto.split(',').map(t => t.trim()).filter(t => t) : []

  try {
    const aulaSalva = await salvarAula({
      turmaId: turmaTemp.value.id,
      turmaCodigo: turmaTemp.value.codigo,
      titulo: novaAula.value.titulo,
      dataLancamento: novaAula.value.dataLancamento,
      liberado: novaAula.value.liberado,
      videoId: extrairVideoId(novaAula.value.videoId),
      descricao: novaAula.value.descricao,
      topicos: topicosArray,
      pdfs: []
    })

    // upload dos PDFs após criar a aula
    if (novaAula.value.pdfs.length > 0 && aulaSalva.id) {
      for (const arquivo of novaAula.value.pdfs) {
        try {
          await uploadPdf(turmaTemp.value.id, aulaSalva.id, arquivo)
        } catch (erroPdf) {
          console.error(`Erro ao enviar PDF "${arquivo.name}":`, erroPdf)
          alert(`PDF "${arquivo.name}" não pôde ser enviado: ${erroPdf.message}`)
        }
      }
    }

    cursos.value.push(turmaTemp.value)
    mostrarModalNovaTurma.value = false
    etapa.value = 'turma'
    novaTurma.value = { titulo: '', codigo: '', cor: '#FFD700', icone: '🌻', nivel: 'Iniciante' }
    novaAula.value = { titulo: '', dataLancamento: '', liberado: true, videoId: '', descricao: '', topicosTexto: '', topicos: [], pdfs: [] }
    turmaTemp.value = null
  } catch (error) {
    console.error('Erro ao criar aula:', error)
    alert('Erro ao criar aula. Tente novamente.')
  }
}
</script>