<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-6 overflow-y-auto font-['Quicksand'] hide-scrollbar">
    <BackButton
      button-class="fixed top-8 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.push('/menu')"
    />

    <div class="w-full text-center mt-16 mb-8 shrink-0">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import FooterAnjos from '../../components/sala/FooterAnjos.vue'
import { cursos as cursosSalas } from './salasCurso.js'

const router = useRouter()
const cursos = ref(cursosSalas)

const irParaListaAulas = (curso) => {
  router.push({ name: 'ListaAulasSala', params: { salaId: String(curso.id) } })
}
</script>