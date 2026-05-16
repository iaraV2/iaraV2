<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white w-full">
    
    <!-- HEADER & BOTÃO VOLTAR -->
    <!-- Mudado para max-w-md para alinhar com a nova largura da lista -->
    <header class="w-full max-w-md mt-6 mb-8 shrink-0 relative px-2">
      <button
  type="button"
  @click="router.back()"
  class="absolute left-4 top-10 w-9 h-9 z-50 pointer-events-auto flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="m15 18-6-6 6-6"/>
  </svg>
</button>

      <h1 class="relative top-8 text-3xl font-bold text-center px-12">Favoritos</h1>
      <p class=" relative top-8 text-cyan-300/90 text-sm font-semibold mt-2 text-center tracking-wide uppercase">
        Suas aulas favoritas
      </p>
    </header>

    <!-- Remix Icon -->
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

    <!-- LISTA DE FAVORITOS -->
    <main class="w-[85%] max-w-md flex-1 px-2 flex flex-col gap-14">
      
      <!-- Estado Vazio -->
      <div v-if="favoritos.length === 0" class="text-center text-white/60 py-12">
        <span class="text-6xl mb-4 block">❤️</span>
        <p class="text-lg font-bold mb-2">Você ainda não tem favoritos</p>
        <p class="text-sm">
          Toque no ícone de coração em uma aula para favoritá-la
        </p>
      </div>

      <!-- Lista de Cards -->
      <div v-else class="  relative top-11 flex flex-col gap-2 mt-10"> <div
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

    <!-- Navegação Inferior -->
    <nav class="fixed bottom-0 h-[10%] left-0 right-0 bg-[#420583]/90 backdrop-blur-md border-t border-white/10 px-8 py-3 flex justify-between items-center z-[2000]">
      
      <!-- Minha Sala -->
      <div @click="router.push('/sala-de-aula')" class="flex flex-col items-center gap-1 cursor-pointer group relative left-[3%]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
        <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 transition-opacity relative bottom-[5px]">Minha Sala</span>
      </div>

      <!-- Favoritos (Ativo) -->
      <div class="flex flex-col items-center gap-1 cursor-pointer group">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 opacity-100 transition-opacity">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <span class="text-[10px] font-semibold text-red-400 opacity-100 tracking-wide  relative bottom-[5px]"> Meus Favoritos</span>
      </div>

      <!-- Perfil -->
      <div @click="router.push('/perfil')" class="flex flex-col items-center gap-1 cursor-pointer group  relative right-[5%]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 transition-opacity relative bottom-[5px]">Perfil</span>
      </div>
      
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const favoritos = ref([])

onMounted(() => {
  carregarFavoritos()
})

function carregarFavoritos() {
  const favs = localStorage.getItem('favoritos')
  if (favs) {
    favoritos.value = JSON.parse(favs)
  }
}

function removerFavorito(id) {
  const index = favoritos.value.findIndex(f => f.id === id)
  if (index > -1) {
    favoritos.value.splice(index, 1)
    localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
  }
}

function irParaAula(fav) {
  router.push({
    name: 'Aula',
    params: {
      id: fav.id,
      titulo: fav.titulo,
      nivel: fav.nivel,
      progresso: fav.progresso || 0,
      videoId: fav.videoId || 'dQw4w9WgXcQ'
    },
    query: { desc: encodeURIComponent(fav.descricao || '') }
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
</style>