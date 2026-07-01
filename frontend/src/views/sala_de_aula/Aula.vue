<template>

<div class="w-full flex flex-col items-center py-6 px-4 pb-48 md:pb-[45vh] font-['Quicksand'] text-white hide-scrollbar relative bg-[#380075] container-aula" style="height: 100dvh; overflow-y: auto; overflow-x: hidden;">
    <div class="absolute top-20 left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="absolute -top-20 -left-10 w-40 h-40 sm:w-90 sm:h-90 rounded-full opacity-40 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-20 right-10 w-32 h-32 sm:top-40 sm:right-32 sm:w-70 sm:h-70 rounded-full opacity-35 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 sm:bottom-48 sm:left-40 sm:w-50 sm:h-50 rounded-full opacity-18 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute bottom-32 right-10 w-20 h-20 sm:bottom-32 sm:right-40 sm:w-44 sm:h-44 rounded-full opacity-15 z-0" style=" background-color: #7a3cae;"></div>
    <div class="absolute top-60 left-5 w-8 h-8 sm:top-80 sm:left-16 sm:w-9 sm:h-9 rounded-full opacity-12 z-0" style=" background-color: #7a3cae;"></div>

    <div class="w-full max-w-4xl mx-auto mb-8 px-4 pt-6 relative top-[1.2rem]">

      <div class="flex items-center justify-center gap-6">

        <BackButton

          button-class="fixed top-6 left-5 z-[1000] w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"

          @click="router.back()"

        />

        <h1 class="text-xl md:text-3xl text-center font-bold max-w-[13ch] md:max-w-[16ch] block leading-tight break-words text-white px-12">{{ titulo }}</h1>

        <button

          @click="toggleFavorito"

          class="fixed top-6 right-5 z-[1000] w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"

        >

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorito ? '#ef4444' : 'none'" :stroke="isFavorito ? '#ef4444' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-colors">

            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>

          </svg>

        </button>

      </div>

    </div>



    <div
      class="w-[90%] max-w-4xl mb-10 relative top-[2rem]"
    >
      <div class="aspect-video bg-black rounded-[10px] overflow-hidden shadow-2xl border border-white/10 relative">

      <div
        v-if="!progressoAula.videoAssistido && !isProfessor"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer group"
        @click="iniciarVideo"
      >
        <div class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#420583" class="w-8 h-8 ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>

      <iframe
        class="w-full h-full"
        :class="{ 'pointer-events-none': !progressoAula.videoAssistido && !isProfessor }"
        :src="`https://www.youtube.com/embed/${videoId}?enablejsapi=1`"
        :title="`Aula: ${titulo}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      </div>

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

                <div class="flex gap-2 justify-center w-full relative -top-2 ml-2">
  <button
    type="button"
    @click="visualizarPdf(pdf)"
    class="inline-flex items-center justify-center text-xs font-bold text-[#420583] bg-purple-100 hover:bg-purple-200 min-w-[80px] md:min-w-[100px] px-3 py-1 rounded-full transition-all"
  >
    {{ pdfVisualizandoId === pdf.id ? 'Fechar' : 'Visualizar' }}
  </button>

  <button
    type="button"
    @click="fazerDownload(pdf)"
    class="inline-flex items-center justify-center text-xs font-bold text-[#420583] bg-cyan-100 hover:bg-cyan-200 min-w-[80px] md:min-w-[100px] px-3 py-1 rounded-full transition-all"
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

    
    
  </div>

  <!-- Modal de Logout -->
  <div v-if="mostrarModalLogout" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[3000] backdrop-blur-sm animate-fadeIn">
    <div class="bg-white rounded-3xl p-8 w-85 h-22 shadow-2xl text-center">
      <h3 class="font-['Quicksand'] font-bold text-[#420583] text-2xl mb-2">Sair da conta?</h3>
      <p class="font-['Quicksand'] text-gray-500 text-sm mb-6">Tem certeza que deseja se desconectar da IAra?</p>
      <div class="flex justify-center gap-3">
        <button @click="fecharModalLogout" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">Não</button>
        <button @click="efetuarLogout" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-white bg-[#e25300] hover:bg-[#ff7b00] transition-colors">Sim, Sair</button>
      </div>
    </div>
  </div>

  <SalaBottomNav @abrirModalLogout="abrirModalLogout" />

</template>



<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import BackButton from '../../components/ui/BackButton.vue'

import { useFavoritos } from '../../composables/useFavoritos.js'

import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'

import { listarPdfs, obterPdfBlob, baixarPdf, buscarAulaPorId, salvarProgressoAula, buscarProgressoAula } from '../../services/firebase.js'

import { useAuthStore } from '../../stores/auth.js'

import { calcularProgressoAula, estiloBordaProgresso } from '../../composables/useProgressoAula.js'



const router = useRouter()

const route = useRoute()

const authStore = useAuthStore()

const { favoritos, salvarFavoritos } = useFavoritos()

const mostrarModalLogout = ref(false)



const titulo = ref(route.params.titulo || 'Aula')

const nivel = ref(route.params.nivel || 'Básico')

const progresso = ref(route.params.progresso || 0)

const videoId = ref(route.params.videoId || 'dQw4w9WgXcQ')

const routeId = route.params.id || ''
let parsedTurmaId = route.query.turmaId || ''
let parsedConteudoId = route.query.conteudoId || ''

if (!parsedTurmaId && !parsedConteudoId && routeId.includes('-')) {
  const parts = routeId.split('-')
  if (parts.length >= 2) {
    parsedTurmaId = parts[0]
    parsedConteudoId = parts.slice(1).join('-')
  }
}

const turmaId = ref(parsedTurmaId)
const conteudoId = ref(parsedConteudoId)



const pdfsDoBackend = ref([])

const topicosDaAula = ref(null)

const descricaoDaAula = ref(null)

const carregandoPdfs = ref(false)
const pdfsCarregados = ref(false)

const pdfVisualizandoId = ref(null)

const carregandoPreview = ref(false)

const urlsPreview = ref({})


const progressoAula = ref({
  videoAssistido: false,
  pdfVisualizado: false,
  pdfBaixado: false,
  concluidoManual: false,
  progresso: 0
})

const isProfessor = computed(() => authStore.usuario?.role === 'professor')
const salvandoProgresso = ref(false)

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
  const promessas = []

  if (turmaId.value && conteudoId.value && !isProfessor.value) {
    promessas.push(
      buscarProgressoAula(turmaId.value, conteudoId.value)
        .then(salvo => {
          progressoAula.value = { ...progressoPadrao(), ...salvo, progresso: salvo.progresso ?? calcularProgressoAula(salvo) }
        })
        .catch(error => console.error('Erro ao carregar progresso:', error))
    )
  }

  if (temIdsParaPdf.value) {
    carregandoPdfs.value = true
    promessas.push(
      buscarAulaPorId(turmaId.value, conteudoId.value)
        .then(aula => {
          if (aula) {
            if (Array.isArray(aula.topicos) && aula.topicos.length) {
              topicosDaAula.value = aula.topicos
            }
            if (aula.descricao) descricaoDaAula.value = aula.descricao
          }
        })
        .catch(error => console.error('Erro ao carregar dados da aula:', error))
    )

    promessas.push(
      listarPdfs(turmaId.value, conteudoId.value)
        .then(pdfs => {
          pdfsDoBackend.value = pdfs
        })
        .catch(error => console.error('Erro ao carregar PDFsStrategic:', error))
    )
  }

  if (promessas.length) {
    await Promise.all(promessas)
  }
  carregandoPdfs.value = false
  pdfsCarregados.value = true
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

    if (!progressoAula.value.pdfVisualizado) {
      progressoAula.value.pdfVisualizado = true
      await persistirProgresso()
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

    if (!progressoAula.value.pdfBaixado) {
      progressoAula.value.pdfBaixado = true
      await persistirProgresso()
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



function progressoPadrao() {
  return {
    videoAssistido: false,
    pdfVisualizado: false,
    pdfBaixado: false,
    concluidoManual: false,
    progresso: 0,
  }
}

async function persistirProgresso() {
  if (isProfessor.value || !turmaId.value || !conteudoId.value || salvandoProgresso.value) return

  const temPdf = pdfsCarregados.value ? pdfsDoBackend.value.length > 0 : true
  progressoAula.value.progresso = calcularProgressoAula(progressoAula.value, { temPdf })
  salvandoProgresso.value = true

  try {
    const resultado = await salvarProgressoAula(turmaId.value, conteudoId.value, {
      videoAssistido: progressoAula.value.videoAssistido,
      pdfVisualizado: progressoAula.value.pdfVisualizado,
      pdfBaixado: progressoAula.value.pdfBaixado,
      concluidoManual: progressoAula.value.concluidoManual,
    })
    if (resultado?.progresso != null) {
      progressoAula.value.progresso = resultado.progresso
    }
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    alert('Não foi possível salvar seu progresso. Verifique sua conexão ou tente novamente.')
  } finally {
    salvandoProgresso.value = false
  }
}

async function iniciarVideo() {
  if (isProfessor.value || progressoAula.value.videoAssistido) return

  progressoAula.value.videoAssistido = true
  await persistirProgresso()

  // Envia comando de play ao player do YouTube usando postMessage
  const iframe = document.querySelector('iframe')
  if (iframe) {
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
  }
}

function abrirModalLogout() {
  mostrarModalLogout.value = true
}

function fecharModalLogout() {
  mostrarModalLogout.value = false
}

function efetuarLogout() {
  authStore.logout()
  fecharModalLogout()
}

</script>

<style scoped>


.borda-concluida {
  background: #22c55e !important; /* Cor sólida verde */
  padding: 2px !important;         /* Força a espessura de 2px */
  box-shadow: none !important;     /* Remove o brilho */
  animation: none !important;     /* Remove o pulso */
}

@media (min-width: 1024px) and (max-width: 1440px) {
  .container-aula {
    padding-bottom: 200px !important;
  }
}

</style>