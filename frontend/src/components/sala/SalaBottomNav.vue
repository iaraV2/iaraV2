<template>
  <nav class="fixed bottom-0 h-[10%] left-0 right-0 bg-[#420583]/90 backdrop-blur-md border-t border-white/10 px-8 py-3 flex justify-between items-center z-[2000]">
    <!-- Logout Button -->
    <div
      class="flex flex-col items-center gap-1 cursor-pointer group relative left-[5%]"
      @click="$emit('abrirModalLogout')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80 group-hover:text-red-400">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 group-hover:text-red-400 transition-opacity relative bottom-[5px]">Sair</span>
    </div>

    <div
      class="flex flex-col items-center gap-1 cursor-pointer group relative left-[3%]"
      :class="{ 'pointer-events-none': abaAtiva === 'sala' }"
      @click="abaAtiva !== 'sala' && router.push('/menu')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 transition-opacity relative bottom-[5px]">Home</span>
    </div>

    <div
      class="flex flex-col items-center gap-1 cursor-pointer group"
      :class="{ 'pointer-events-none': abaAtiva === 'favoritos' }"
      @click="abaAtiva !== 'favoritos' && router.push('/favoritos')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="favoritosAtivo ? '#ef4444' : 'none'"
        :stroke="favoritosAtivo ? '#ef4444' : 'white'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-6 h-6 transition-opacity group-hover:opacity-80"
        :class="favoritosAtivo ? 'opacity-100' : 'opacity-40'"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span
        class="text-[10px] font-semibold tracking-wide transition-opacity relative bottom-[5px]"
        :class="favoritosAtivo ? 'text-red-400 opacity-100' : 'text-white opacity-40 group-hover:opacity-80'"
      >
        {{ rotuloFavoritos }}
      </span>
    </div>

    <div
      class="flex flex-col items-center gap-1 cursor-pointer group relative right-[5%]"
      :class="{ 'pointer-events-none': abaAtiva === 'perfil' }"
      @click="abaAtiva !== 'perfil' && router.push('/perfil')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-6 h-6 transition-opacity"
        :class="abaAtiva === 'perfil' ? 'text-cyan-400 opacity-100' : 'text-white opacity-40 group-hover:opacity-80'"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span
        class="text-[10px] font-semibold tracking-wide relative bottom-[5px]"
        :class="abaAtiva === 'perfil' ? 'text-cyan-400 opacity-100' : 'text-white opacity-40 group-hover:opacity-80 transition-opacity'"
      >
        Perfil
      </span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  abaAtiva: { type: String, default: '' },
  favoritosDestaque: { type: Boolean, default: false },
  rotuloFavoritos: { type: String, default: 'Meus Favoritos' },
})

const router = useRouter()
const favoritosAtivo = computed(() => props.abaAtiva === 'favoritos' || props.favoritosDestaque)
</script>
