<template>
  <div class="min-h-screen bg-[#1a064e] flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white">
    
<!-- Cabeçalho: Voltar + Título + Favoritar -->
<div class="w-full max-w-4xl mx-auto mb-8 px-4 pt-6 relative top-[1.2rem]">
  <div class="flex items-center justify-center gap-6">
    
    <!-- Botão Voltar (Estilo Premium Glass) -->
    <button
      type="button"
      @click="router.back()"
      class="w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>

    <!-- Título Centralizado com limite de caracteres -->
    <h1 class="text-xl md:text-3xl text-center font-bold max-w-[13ch] md:max-w-[16ch] block leading-tight break-words text-white">
      {{ titulo }}
    </h1>

    <!-- Botão Favoritar -->
    <button 
      @click="toggleFavorito"
      class="w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        :fill="isFavorito ? '#ef4444' : 'none'" 
        :stroke="isFavorito ? '#ef4444' : 'currentColor'"
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="w-5 h-5 transition-colors"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    </button>

  </div>
</div>

    <!-- Player de Vídeo -->
    <div class="w-[90%]  max-w-4xl aspect-video bg-black rounded-[10px]  overflow-hidden shadow-2xl mb-10 border border-white/10 relative top-[2rem]">
      <iframe 
        class="w-full h-full"
        :src="`https://www.youtube.com/embed/${videoId}`" 
        :title="`Aula: ${titulo}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Cards de Conteúdo -->
    <div class="w-[88%] max-w-4xl space-y-6">
      
      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3rem]">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-1xl text-[#420583]"></span>
        </div>
        <div>
          <h2 class="text-md font-bold text-[#420583] mb-2">O que você vai aprender nessa aula</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ descricao }}
          </p>
        </div>
      </div>

      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3.3rem]">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-2xl text-[#420583]"></span>
        </div>
        <div class="w-full">
          <h2 class="text-md font-bold text-[#420583] mb-4">Tópicos abordados</h2>
          <ul class="space-y-3">
            <li v-for="(item, index) in topicos" :key="index" class="flex items-center gap-3 text-gray-700 text-sm border-b border-gray-50 pb-2 last:border-0">
              <span class="text-green-500 font-bold">✓</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white rounded-[10px] p-6 flex gap-4 items-start shadow-lg relative top-[3.5rem]">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-2xl text-[#420583]"></span>
        </div>
        <div class="w-full">
          <h2 class="text-md font-bold text-[#420583] mb-2">Material complementar</h2>
          <p class="text-gray-500 text-xs mb-4">Baixe o PDF com o resumo completo para estudar offline.</p>
          
          
        </div>
      </div>

    </div>

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

  <!-- Favoritos -->
  <div @click="router.push('/favoritos')" class="flex flex-col items-center gap-1 cursor-pointer group">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorito ? '#ef4444' : 'none'" :stroke="isFavorito ? '#ef4444' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 transition-opacity group-hover:opacity-80" :class="isFavorito ? 'opacity-100' : 'opacity-40'">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
    <span class="text-[10px] font-semibold tracking-wide transition-opacity relative bottom-[5px]" :class="isFavorito ? 'text-red-400 opacity-100' : 'text-white opacity-40 group-hover:opacity-80'">Meus Favoritos</span>
  </div>

  <!-- Perfil -->
  <div @click="router.push('/perfil')" class="flex flex-col items-center gap-1 cursor-pointer group relative right-[5%]">
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Recebe os parâmetros enviados pela Sala de Aula
const titulo = ref(route.params.titulo || "Aula")
const nivel = ref(route.params.nivel || "Básico")
const progresso = ref(route.params.progresso || 0)
const descricao = ref(route.params.descricao || "Descrição da aula não disponível.")
const videoId = ref(route.params.videoId || "dQw4w9WgXcQ")

const topicos = ref([
  "Introdução ao conteúdo prático",
  "Estratégias de aplicação imediata",
  "Principais ferramentas recomendadas",
  "Como evitar os erros mais comuns do mercado",
  "Resumo e próximos passos para o sucesso"
])

const formatarTitulo = (t) => t.replace(/\s+/g, '_')

// Sistema de favoritos
const favoritos = ref([])
const isFavorito = computed(() => {
  const aulaId = route.params.id || `${titulo.value}-${videoId.value}`
  return favoritos.value.some(f => f.id === aulaId)
})

onMounted(() => {
  carregarFavoritos()
})

function carregarFavoritos() {
  const favs = localStorage.getItem('favoritos')
  if (favs) {
    favoritos.value = JSON.parse(favs)
  }
}

function toggleFavorito() {
  const aulaId = route.params.id || `${titulo.value}-${videoId.value}`
  const aulaData = {
    id: aulaId,
    titulo: titulo.value,
    nivel: nivel.value,
    progresso: progresso.value,
    videoId: videoId.value,
    descricao: descricao.value
  }

  const index = favoritos.value.findIndex(f => f.id === aulaId)
  
  if (index > -1) {
    favoritos.value.splice(index, 1)
  } else {
    favoritos.value.push(aulaData)
  }
  
  localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
}
</script>

<style scoped>
div { scrollbar-width: none; }
div::-webkit-scrollbar { display: none; }
</style>