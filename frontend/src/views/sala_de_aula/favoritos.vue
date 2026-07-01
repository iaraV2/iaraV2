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
    
    <header class="w-full max-w-md mt-6 mb-8 shrink-0 relative px-2">
      <BackButton
        button-class="absolute left-4 top-10 sm:fixed sm:top-6 sm:left-5 w-9 h-9 sm:w-10 sm:h-10 z-[1000] pointer-events-auto flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105"
        @click="router.back()"
      />
      <h1 class="relative top-8 text-3xl font-bold text-center px-12">Favoritos</h1>
      <p class=" relative top-8 text-cyan-300/90 text-sm font-semibold mt-2 text-center tracking-wide uppercase">Suas aulas favoritas</p>
    </header>

    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

    <!-- Largura da lista ainda mais expandida em resoluções maiores -->
    <main class="w-[85%] md:w-full max-w-md md:max-w-2xl lg:max-w-4xl flex-1 px-2 flex flex-col gap-14">
      <div v-if="favoritos.length === 0" class="text-center text-white/60 py-12">
        <span class="text-6xl mb-4 block relative top-6">❤️</span>
        <p class="text-lg font-bold mb-2 relative top-6">Você ainda não tem favoritos</p>
        <p class="text-sm relative top-6">Toque no ícone de coração em uma aula para favoritá-la</p>
      </div>
      <div v-else class="  relative top-11 flex flex-col gap-2 mt-10">
        <div
          v-for="fav in favoritos"
          :key="fav.id"
          class="w-full bg-white rounded-[24px] p-5 shadow-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform"
          @click="irParaAula(fav)"
        >
          <div class="flex-1 min-w-0 pr-2 relative top-1 left-[10px]">
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

    <SalaBottomNav aba-ativa="favoritos" rotulo-favoritos=" Meus Favoritos" @abrirModalLogout="abrirModalLogout" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'
import { useFavoritos } from '../../composables/useFavoritos.js'
import { useNavegacaoAula } from '../../composables/useNavegacaoAula.js'
import { useAuthStore } from '../../stores/auth.js'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const { favoritos, removerFavorito } = useFavoritos()
const { irParaAula } = useNavegacaoAula()

const mostrarModalLogout = ref(false)

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