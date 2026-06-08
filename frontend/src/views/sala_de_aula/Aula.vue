<template>

  <div class="w-full h-full flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white hide-scrollbar relative bg-[#380075]">
    <!-- Abstract shapes -->
    <div class="absolute top-20 left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <!-- Purple circles -->
    <div class="absolute -top-20 -left-10 w-40 h-40 sm:w-90 sm:h-90 rounded-full opacity-40 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-20 right-10 w-32 h-32 sm:top-40 sm:right-32 sm:w-70 sm:h-70 rounded-full opacity-35 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 sm:bottom-48 sm:left-40 sm:w-50 sm:h-50 rounded-full opacity-18 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-32 right-10 w-20 h-20 sm:bottom-32 sm:right-40 sm:w-44 sm:h-44 rounded-full opacity-15 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-60 left-5 w-8 h-8 sm:top-80 sm:left-16 sm:w-9 sm:h-9 rounded-full opacity-12 z-0" style=" background-color: #7a3cae;"></div>

    <div class="w-full max-w-4xl mx-auto mb-8 px-4 pt-6 relative top-[1.2rem]">

      <div class="flex items-center justify-center gap-6">

        <BackButton

          button-class="w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"

          @click="router.back()"

        />

        <h1 class="text-xl md:text-3xl text-center font-bold max-w-[13ch] md:max-w-[16ch] block leading-tight break-words text-white">{{ titulo }}</h1>

        <button

          @click="toggleFavorito"

          class="w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"

        >

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorito ? '#ef4444' : 'none'" :stroke="isFavorito ? '#ef4444' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-colors">

            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>

          </svg>

        </button>

      </div>

    </div>



    <div class="w-[90%] max-w-4xl aspect-video bg-black rounded-[10px] overflow-hidden shadow-2xl mb-10 border border-white/10 relative top-[2rem]">

      <iframe class="w-full h-full" :src="`https://www.youtube.com/embed/${videoId}`" :title="`Aula: ${titulo}`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

    </div>



    <div class="w-[88%] max-w-4xl space-y-6">

      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3rem]">

        <div class="bg-purple-100 p-3 rounded-2xl"><span class="text-1xl text-[#420583]"></span></div>

        <div>

          <h2 class="text-md font-bold text-[#420583] mb-2">O que você vai aprender nessa aula</h2>

          <p class="text-gray-600 text-sm leading-relaxed">{{ descricao }}</p>

        </div>

      </div>



      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3.3rem]">

        <div class="bg-purple-100 p-3 rounded-2xl"><span class="text-2xl text-[#420583]"></span></div>

        <div class="w-full">

          <h2 class="text-md font-bold text-[#420583] mb-4">Tópicos abordados</h2>

          <p v-if="topicos.length === 0" class="text-gray-500 text-xs">Nenhum tópico cadastrado para esta aula.</p>
          <ul v-else class="space-y-3">
            <li v-for="(item, index) in topicos" :key="index" class="flex items-center gap-3 text-gray-700 text-sm border-b border-gray-50 pb-2 last:border-0">
              <span class="text-green-500 font-bold">✓</span>{{ item }}
            </li>
          </ul>

        </div>

      </div>



      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3.5rem]">

        <div class="bg-purple-100 p-3 rounded-2xl"><span class="text-2xl text-[#420583]"></span></div>

        <div class="w-full">

          <h2 class="text-md font-bold text-[#420583] mb-2">Material complementar</h2>

          <p v-if="!temIdsParaPdf" class="text-gray-500 text-xs mb-4">Materiais em PDF não disponíveis para esta aula (turma não vinculada).</p>

          <p v-else-if="carregandoPdfs" class="text-gray-400 text-xs">Carregando materiais...</p>

          <p v-else-if="pdfsDoBackend.length === 0" class="text-gray-500 text-xs mb-4">Nenhum material disponível para esta aula.</p>

          <div v-else class="space-y-4">

            <div

              v-for="pdf in pdfsDoBackend"

              :key="pdf.id"

              class="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"

            >

              <div class="flex items-center justify-between gap-2 flex-wrap">

                <div class="flex items-center gap-2">

                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>

                    <polyline points="14 2 14 8 20 8"/>

                  </svg>

                  <span class="text-sm text-gray-700">{{ pdf.nome }}</span>

                </div>

                <div class="flex gap-2">

                  <button

                    type="button"

                    @click="visualizarPdf(pdf)"

                    class="text-xs font-bold text-[#420583] bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-full transition-all"

                  >

                    {{ pdfVisualizandoId === pdf.id ? 'Ocultar' : 'Visualizar' }}

                  </button>

                  <button

                    type="button"

                    @click="fazerDownload(pdf)"

                    class="text-xs font-bold text-[#420583] bg-cyan-100 hover:bg-cyan-200 px-3 py-1 rounded-full transition-all"

                  >

                    Baixar

                  </button>

                </div>

              </div>

              <div

                v-if="pdfVisualizandoId === pdf.id && urlsPreview[pdf.id]"

                class="w-full rounded-lg overflow-hidden border border-gray-200 bg-white"

              >

                <iframe

                  :src="urlsPreview[pdf.id]"

                  :title="pdf.nome"

                  class="w-full h-[min(70vh,480px)]"

                />

              </div>

              <p v-else-if="pdfVisualizandoId === pdf.id && carregandoPreview" class="text-xs text-gray-500">Carregando visualização...</p>

            </div>

          </div>

        </div>

      </div>

    </div>

    
    <div class="fixed bottom-13 left-0 w-full px-4 shrink-0 z-50 flex justify-center">
  <div class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl sm:rounded-full shadow-xl border border-white/20 flex items-center justify-center gap-1.5 max-w-[280px] sm:max-w-fit mx-auto">
    <span class="text-base shrink-0">💡</span>
    <p class="text-gray-700 text-[11px] sm:text-xs font-medium text-center leading-tight">
      Continue seus estudos regularmente para manter o progresso!
    </p>
  </div>
</div>

  </div>

  <SalaBottomNav />

</template>



<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import BackButton from '../../components/ui/BackButton.vue'

import { useFavoritos } from '../../composables/useFavoritos.js'

import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'

import { listarPdfs, obterPdfBlob, baixarPdf, buscarAulaPorId, salvarProgressoAula, buscarProgressoAula } from '../../services/firebase.js'



const router = useRouter()

const route = useRoute()

const { favoritos, salvarFavoritos } = useFavoritos()



const titulo = ref(route.params.titulo || 'Aula')

const nivel = ref(route.params.nivel || 'Básico')

const progresso = ref(route.params.progresso || 0)

const videoId = ref(route.params.videoId || 'dQw4w9WgXcQ')

const turmaId = ref(route.query.turmaId || '')

const conteudoId = ref(route.query.conteudoId || '')



const pdfsDoBackend = ref([])

const topicosDaAula = ref(null)

const descricaoDaAula = ref(null)

const carregandoPdfs = ref(false)

const pdfVisualizandoId = ref(null)

const carregandoPreview = ref(false)

const urlsPreview = ref({})

// Progresso da aula
const progressoAula = ref({
  videoAssistido: false,
  pdfVisualizado: false,
  pdfBaixado: false,
  progresso: 0
})

const temIdsParaPdf = computed(() => Boolean(turmaId.value && conteudoId.value))



const descricao = computed(() => {

  if (descricaoDaAula.value) return descricaoDaAula.value

  if (route.query.desc) return decodeURIComponent(route.query.desc)

  return 'Descrição da aula não disponível.'

})



const topicos = computed(() => {

  if (topicosDaAula.value?.length) return topicosDaAula.value

  const source = route.query.topicos

  if (source) {

    try {
      const parsed = JSON.parse(decodeURIComponent(source))
      if (Array.isArray(parsed) && parsed.length) return parsed
    } catch { /* ignora */ }

  }

  return []

})



onMounted(async () => {

  if (!temIdsParaPdf.value) return

  carregandoPdfs.value = true

  try {

    const aula = await buscarAulaPorId(turmaId.value, conteudoId.value)

    if (aula) {

      if (Array.isArray(aula.topicos) && aula.topicos.length) {

        topicosDaAula.value = aula.topicos

      }

      if (aula.descricao) descricaoDaAula.value = aula.descricao

    }

    pdfsDoBackend.value = await listarPdfs(turmaId.value, conteudoId.value)

    // Carregar progresso da aula (desativado até backend implementado)
    // const progressoSalvo = await buscarProgressoAula(turmaId.value, conteudoId.value)
    // if (progressoSalvo) {
    //   progressoAula.value = progressoSalvo
    // }

    // Configurar rastreamento de vídeo
    configurarRastreamentoVideo()

  } catch (error) {

    console.error('Erro ao carregar dados da aula:', error)

  } finally {

    carregandoPdfs.value = false

  }

})



onBeforeUnmount(() => {

  Object.values(urlsPreview.value).forEach(url => URL.revokeObjectURL(url))

})



async function visualizarPdf(pdf) {

  if (pdfVisualizandoId.value === pdf.id) {

    pdfVisualizandoId.value = null

    return

  }

  pdfVisualizandoId.value = pdf.id

  if (urlsPreview.value[pdf.id]) return

  carregandoPreview.value = true

  try {

    const blob = await obterPdfBlob(turmaId.value, conteudoId.value, pdf.id)

    urlsPreview.value[pdf.id] = URL.createObjectURL(blob)

    // Marcar PDF como visualizado (25% de progresso)
    if (!progressoAula.value.pdfVisualizado) {
      progressoAula.value.pdfVisualizado = true
      // await atualizarProgresso() // Desativado até backend implementado
    }

  } catch (error) {

    console.error('Erro ao visualizar PDF:', error)

    alert('Não foi possível exibir o PDF. Tente baixar o arquivo.')

    pdfVisualizandoId.value = null

  } finally {

    carregandoPreview.value = false

  }

}



async function fazerDownload(pdf) {

  try {

    await baixarPdf(turmaId.value, conteudoId.value, pdf.id, pdf.nome)

    // Marcar PDF como baixado (25% de progresso)
    if (!progressoAula.value.pdfBaixado) {
      progressoAula.value.pdfBaixado = true
      // await atualizarProgresso() // Desativado até backend implementado
    }

  } catch (error) {

    console.error('Erro ao baixar PDF:', error)

    alert('Erro ao baixar o material. Tente novamente.')

  }

}



const aulaId = computed(() => route.params.id || `${titulo.value}-${videoId.value}`)

const isFavorito = computed(() => favoritos.value.some((f) => f.id === aulaId.value))



function toggleFavorito() {

  const aulaData = {

    id: aulaId.value, titulo: titulo.value, nivel: nivel.value,

    progresso: progresso.value, videoId: videoId.value, descricao: descricao.value,

  }

  const index = favoritos.value.findIndex((f) => f.id === aulaId.value)

  if (index > -1) favoritos.value.splice(index, 1)

  else favoritos.value.push(aulaData)

  salvarFavoritos()

}

// ─── Rastreamento de Progresso ─────────────────────────────────────────────────

function calcularProgresso() {
  let progresso = 0
  if (progressoAula.value.videoAssistido) progresso += 50
  if (progressoAula.value.pdfVisualizado) progresso += 25
  if (progressoAula.value.pdfBaixado) progresso += 25
  return Math.min(progresso, 100)
}

async function atualizarProgresso() {
  progressoAula.value.progresso = calcularProgresso()
  // try {
  //   await salvarProgressoAula(turmaId.value, conteudoId.value, progressoAula.value)
  // } catch (error) {
  //   console.error('Erro ao salvar progresso:', error)
  // }
}

function configurarRastreamentoVideo() {
  // Usar YouTube Player API para rastrear quando o vídeo é assistido completamente
  // Isso requer integração com a API do YouTube
  // Por enquanto, vamos usar um timeout simples quando o usuário ficar na página
  const videoWatched = localStorage.getItem(`video_${turmaId.value}_${conteudoId.value}`)
  if (videoWatched === 'true') {
    progressoAula.value.videoAssistido = true
    // atualizarProgresso() // Desativado até backend implementado
  }
}

// Marcar vídeo como assistido após 90% do tempo ou quando o usuário assistir completamente
function marcarVideoAssistido() {
  if (!progressoAula.value.videoAssistido) {
    progressoAula.value.videoAssistido = true
    localStorage.setItem(`video_${turmaId.value}_${conteudoId.value}`, 'true')
    // atualizarProgresso() // Desativado até backend implementado
  }
}

</script>

