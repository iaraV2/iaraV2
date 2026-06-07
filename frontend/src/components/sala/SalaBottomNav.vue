<template>
  <nav class="fixed bottom-0 h-[10%] left-0 right-0 bg-[#420583]/90 backdrop-blur-md border-t border-white/10 px-8 py-3 flex justify-between items-center z-[2000]">
    <div
      class="flex flex-col items-center gap-1 cursor-pointer group relative left-[3%]"
      :class="{ 'pointer-events-none': abaAtiva === 'sala' }"
      @click="abaAtiva !== 'sala' && router.push('/sala-de-aula')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
      <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 transition-opacity relative bottom-[5px]">Minha Sala</span>
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
        :stroke="favoritosAtivo ? '#ef4444' : 'currentColor'"
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
