<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-4 px-3 pb-12 overflow-y-auto font-['Quicksand']">
    
    <!-- BOTÃO VOLTAR - APENAS ÍCONE DO LADO ESQUERDO -->
    <button
  type="button"
  @click="router.push({ name: 'SalaDeAula' })"
  class="fixed top-5 left-4 z-[1000] w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="m15 18-6-6 6-6"/>
  </svg>
</button>

    <template v-if="curso">

      <!-- HEADER -->
      <header class="w-full max-w-md mt-10 mb-4 shrink-0 px-1">
        <div class="flex items-center justify-between gap-3">

          <div class="flex-1 text-center relative top-5">
            <h1 class="text-white font-bold text-xl md:text-2xl leading-tight">
              {{ curso.titulo }}
            </h1>

            <!-- DESCRIÇÃO COM MARGEM INFERIOR -->
            <div class="mt-4">
              <p class="text-cyan-300/90 text-xs font-semibold tracking-wide uppercase">
                Aulas da semana
              </p>
            </div>
          </div>

        </div>
      </header>

      <!-- LISTA DE AULAS - COM MAIS ESPAÇAMENTO SUPERIOR -->
      <div class="w-full max-w-md flex flex-col gap-3 px-1 mt-8 relative top-8">

        <article
          v-for="aula in curso.aulasSemana"
          :key="aula.id"
          class="bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-2"
        >

          <div class="flex items-start gap-2">

            <!-- CONTEÚDO -->
            <div class="min-w-0 flex-1 relative left-2 top-2">

              <!-- TÍTULO + CADEADO -->
              <div class="flex items-center gap-1.5 flex-wrap">

                <h2 class="text-[#420583] font-bold text-base leading-snug">
                  {{ aula.titulo }}
                </h2>

                <!-- CADEADO -->
                <div class="shrink-0">

                  <!-- LIBERADO -->
                  <svg
                    v-if="aula.liberado"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>

                  <!-- BLOQUEADO -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>

                </div>
              </div>

              <!-- DATA -->
              <p class="text-gray-500 text-xs mt-1">
                Publicada em {{ formatarData(aula.dataLancamento) }}
              </p>

            </div>
          </div>

          <!-- BOTÃO -->
          <div class="flex justify-end pr-2 relative bottom-[1.4rem] right-2">
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
      </div>
    </template>

    <!-- NÃO ENCONTRADO -->
    <div
      v-else
      class="mt-24 text-center text-white max-w-xs px-4"
    >
      <p class="text-base font-bold mb-2">
        Sala não encontrada
      </p>

      <button
        type="button"
        @click="router.push({ name: 'SalaDeAula' })"
        class="mt-4 bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors text-sm"
      >
        Voltar às salas
      </button>
    </div>

    <!-- IMAGEM -->
    <div class="mt-8 shrink-0 relative top-8">
      <img
        src="/img/anjos.png"
        alt="Anjos Digitais"
        class="w-20 opacity-70"
      />
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCursoById } from './salasCurso.js'

const props = defineProps({
  salaId: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()
const isMobile = ref(false)

// Detectar se é mobile
onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  
  // Atualizar ao redimensionar
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})

const curso = computed(() => getCursoById(props.salaId))

function formatarData(iso) {
  if (!iso) return '—'

  const d = new Date(`${iso}T12:00:00`)

  if (Number.isNaN(d.getTime())) return iso

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function acessarAula(aula) {
  if (!curso.value || !aula.liberado) return

  const c = curso.value

  const desc =
    aula.descricao != null && aula.descricao !== ''
      ? aula.descricao
      : c.descricao

  router.push({
    name: 'Aula',

    params: {
      id: `${c.id}-${aula.id}`,
      titulo: aula.titulo,
      nivel: c.nivel,
      progresso: aula.progresso ?? c.progresso ?? 0,
      videoId: aula.videoId || c.videoId,
    },

    query: {
      desc: encodeURIComponent(desc),
    },
  })
}
</script>

<style scoped>
div {
  scrollbar-width: none;
}

div::-webkit-scrollbar {
  display: none;
}

/* Garantir margens laterais roxas visíveis em telas muito pequenas */
@media (max-width: 480px) {
  .min-h-screen {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Efeito de movimento no hover do botão */
button.fixed:hover svg {
  transform: translateX(-2px);
  transition: transform 0.2s ease;
}

button.fixed svg {
  transition: transform 0.2s ease;
}
</style>