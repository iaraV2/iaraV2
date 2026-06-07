<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white w-full hide-scrollbar">
    <header class="w-full max-w-md mt-6 mb-8 shrink-0 relative px-2">
      <BackButton
        button-class="absolute left-4 top-10 w-9 h-9 z-50 pointer-events-auto flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105"
        @click="router.back()"
      />
      <h1 class="relative top-8 text-3xl font-bold text-center px-12">Favoritos</h1>
      <p class=" relative top-8 text-cyan-300/90 text-sm font-semibold mt-2 text-center tracking-wide uppercase">Suas aulas favoritas</p>
    </header>

    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

    <main class="w-[85%] max-w-md flex-1 px-2 flex flex-col gap-14">
      <div v-if="favoritos.length === 0" class="text-center text-white/60 py-12">
        <span class="text-6xl mb-4 block">❤️</span>
        <p class="text-lg font-bold mb-2">Você ainda não tem favoritos</p>
        <p class="text-sm">Toque no ícone de coração em uma aula para favoritá-la</p>
      </div>
      <div v-else class="  relative top-11 flex flex-col gap-2 mt-10">
        <div
          v-for="fav in favoritos"
          :key="fav.id"
          class="w-full bg-white rounded-[24px] p-5 shadow-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform"
          @click="irParaAula(fav)"
        >
          <div class="flex-1 min-w-0 pr-2">
            <h4 class="relative left-2 text-[#420583] font-bold text-lg leading-snug truncate"> {{ fav.titulo }} </h4>
            <p class="relative left-2 bottom-2 text-gray-500 text-sm mt-1"> {{ fav.nivel }} </p>
          </div>
          <div class="shrink-0 flex items-center gap-2">
            <button
              @click.stop="removerFavorito(fav.id)"
              class="p-2 rounded-full hover:bg-red-100 transition-colors"
              aria-label="Remover dos favoritos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
            <i class="ri-arrow-right-s-line text-gray-300 text-2xl"></i>
          </div>
        </div>
      </div>
    </main>

    <SalaBottomNav aba-ativa="favoritos" rotulo-favoritos=" Meus Favoritos" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'
import { useFavoritos } from '../../composables/useFavoritos.js'
import { useNavegacaoAula } from '../../composables/useNavegacaoAula.js'

const router = useRouter()
const { favoritos, removerFavorito } = useFavoritos()
const { irParaAula } = useNavegacaoAula()
</script>
