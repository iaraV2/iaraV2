<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-4 px-3 pb-12 overflow-y-auto font-['Quicksand'] hide-scrollbar">
    <BackButton
      button-class="fixed top-5 left-4 z-[1000] w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.push({ name: 'SalaDeAula' })"
    />

    <template v-if="curso">
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

      <section class="w-full max-w-md flex flex-col gap-3 px-1 mt-8 relative top-8">
        <article
          v-for="aula in curso.aulasSemana"
          :key="aula.id"
          class="bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-2"
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
      </section>
    </template>

    <section v-else class="mt-24 text-center text-white max-w-xs px-4">
      <p class="text-base font-bold mb-2">Sala não encontrada</p>
      <button
        type="button"
        @click="router.push({ name: 'SalaDeAula' })"
        class="mt-4 bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition-colors text-sm"
      >
        Voltar às salas
      </button>
    </section>

    <FooterAnjos wrapper-class="mt-8 shrink-0 relative top-8" img-class="w-20 opacity-70" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import IconLock from '../../components/ui/IconLock.vue'
import FooterAnjos from '../../components/sala/FooterAnjos.vue'
import { formatarData } from '../../composables/formatarData.js'
import { getCursoById } from './salasCurso.js'

const props = defineProps({
  salaId: { type: [String, Number], required: true },
})

const router = useRouter()
const curso = computed(() => getCursoById(props.salaId))

function acessarAula(aula) {
  if (!curso.value || !aula.liberado) return
  const c = curso.value
  const desc = aula.descricao != null && aula.descricao !== '' ? aula.descricao : c.descricao
  router.push({
    name: 'Aula',
    params: {
      id: `${c.id}-${aula.id}`,
      titulo: aula.titulo,
      nivel: c.nivel,
      progresso: aula.progresso ?? c.progresso ?? 0,
      videoId: aula.videoId || c.videoId,
    },
    query: { desc: encodeURIComponent(desc) },
  })
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
