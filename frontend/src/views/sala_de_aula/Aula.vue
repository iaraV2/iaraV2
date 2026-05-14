<template>
  <div class="min-h-screen bg-[#1a064e] flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white">
    
    <!-- Cabeçalho de Navegação -->
    <div class="w-full max-w-4xl flex justify-between items-center mb-8">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
      >
        <span class="text-xl">‹</span> Voltar
      </button>
      <span class="bg-[#420583] border border-cyan-400/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-300">
        {{ nivel }}
      </span>
    </div>

    <!-- Título e Progresso -->
    <div class="w-full max-w-4xl mb-8">
      <div class="flex justify-between items-end mb-2">
        <h1 class="text-2xl md:text-3xl font-bold">{{ titulo }}</h1>
        <span class="text-sm font-bold opacity-80">{{ progresso }}%</span>
      </div>
      <p class="text-cyan-400 text-sm md:text-base mb-4">{{ descricao }}</p>
      
      <div class="w-full h-2 bg-[#420583] rounded-full overflow-hidden">
        <div class="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" :style="{ width: progresso + '%' }"></div>
      </div>
    </div>

    <!-- Player de Vídeo -->
    <div class="w-full max-w-4xl aspect-video bg-black rounded-[20px] overflow-hidden shadow-2xl mb-10 border border-white/10">
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
    <div class="w-full max-w-4xl space-y-6">
      
      <div class="bg-white rounded-[25px] p-6 flex gap-4 items-start shadow-lg">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-2xl text-[#420583]">🎓</span>
        </div>
        <div>
          <h2 class="text-[#420583] font-bold text-lg mb-2">O que você vai aprender nessa aula</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ descricao }}
          </p>
        </div>
      </div>

      <div class="bg-white rounded-[25px] p-6 flex gap-4 items-start shadow-lg">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-2xl text-[#420583]">📑</span>
        </div>
        <div class="w-full">
          <h2 class="text-[#420583] font-bold text-lg mb-4">Tópicos abordados</h2>
          <ul class="space-y-3">
            <li v-for="(item, index) in topicos" :key="index" class="flex items-center gap-3 text-gray-700 text-sm border-b border-gray-50 pb-2 last:border-0">
              <span class="text-green-500 font-bold">✓</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white rounded-[25px] p-6 flex gap-4 items-start shadow-lg">
        <div class="bg-purple-100 p-3 rounded-2xl">
          <span class="text-2xl text-[#420583]">📄</span>
        </div>
        <div class="w-full">
          <h2 class="text-[#420583] font-bold text-lg mb-2">Material complementar</h2>
          <p class="text-gray-500 text-xs mb-4">Baixe o PDF com o resumo completo para estudar offline.</p>
          
          <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-purple-300 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-red-500 text-3xl">📕</span>
              <div>
                <p class="text-[#420583] font-bold text-sm">Resumo_{{ formatarTitulo(titulo) }}.pdf</p>
                <p class="text-gray-400 text-xs">1.2 MB</p>
              </div>
            </div>
            <button class="bg-[#420583] text-white p-2 rounded-full hover:scale-110 transition-transform">
              <span class="text-xl">⬇</span>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Navegação Inferior -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#420583] border-t border-white/10 px-6 py-3 flex justify-between items-center z-[2000]">
      <div @click="router.push('/menu')" class="flex flex-col items-center opacity-60 cursor-pointer">
        <span class="text-xl">🏠</span>
        <span class="text-[10px] font-bold">Início</span>
      </div>
      <div @click="router.push('/sala-de-aula')" class="flex flex-col items-center opacity-100 cursor-pointer text-cyan-400">
        <span class="text-xl">🎓</span>
        <span class="text-[10px] font-bold">Minha Sala</span>
      </div>
      <div class="bg-gradient-to-tr from-cyan-400 to-purple-500 p-4 rounded-full -mt-10 shadow-lg border-4 border-[#1a064e]">
        <span class="text-2xl text-white">🚀</span>
      </div>
      <div class="flex flex-col items-center opacity-60">
        <span class="text-xl">❤️</span>
        <span class="text-[10px] font-bold">Favoritos</span>
      </div>
      <div class="flex flex-col items-center opacity-60">
        <span class="text-xl">👤</span>
        <span class="text-[10px] font-bold">Perfil</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
</script>

<style scoped>
div { scrollbar-width: none; }
div::-webkit-scrollbar { display: none; }
</style>