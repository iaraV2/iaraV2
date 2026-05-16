<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-4 pb-24 overflow-y-auto font-['Quicksand'] text-white">
    
    <!-- BOTÃO VOLTAR -->
    <button
      type="button"
      @click="router.back()"
      class="fixed top-5 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>

    <!-- FOTO DE PERFIL -->
    <div class="mt-16 mb-6 flex flex-col items-center">
      <div class="relative">
        <div 
          class="w-32 h-32 translate-y-1/3 rounded-full border-4 border-cyan-400 overflow-hidden bg-[#1a064e] flex items-center justify-center cursor-pointer shadow-xl"
          @click="abrirOpcoes"
        >
          <img 
            v-if="fotoPerfil" 
            :src="fotoPerfil" 
            alt="Foto de perfil" 
            class="w-full h-full object-cover"
          />
          <span v-else class="text-5xl">👤</span>
        </div>
        <button
          @click="abrirOpcoes"
          class="absolute bottom-0 right-0 bg-cyan-400 text-[#420583] w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" x2="12" y1="3" y2="15"/>
          </svg>
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFotoChange"
          class="hidden"
        />
      </div>
    </div>

    <!-- MODAL DE OPÇÕES DA FOTO -->
    <div 
      v-if="mostrarOpcoes" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
      @click.self="mostrarOpcoes = false"
    >
      <div class="bg-[#2a085c] border border-white/10 rounded-[28px] p-6 w-full max-w-xs shadow-2xl flex flex-col items-center gap-4 text-center">
        <h3 class="font-bold text-lg text-white">O que deseja fazer?</h3>
        
        <div class="w-full flex flex-col gap-2 mt-2">
          <button 
            @click="verFoto"
            :disabled="!fotoPerfil"
            class="w-full py-3 px-4 bg-white/10 border border-white/15 rounded-xl font-semibold text-sm text-white transition-all hover:bg-white/20 active:scale-98 disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed"
          >
            Ver foto
          </button>

          <button 
            @click="escolherFoto"
            class="w-full py-3 px-4 bg-cyan-400 rounded-xl font-bold text-sm text-[#420583] shadow-md transition-all hover:bg-cyan-300 hover:scale-[1.02] active:scale-98"
          >
            Escolher foto
          </button>
        </div>

        <button 
          @click="mostrarOpcoes = false"
          class="text-white/40 hover:text-white/80 text-xs font-semibold mt-1 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- MODAL VISUALIZADOR DA FOTO -->
    <div 
      v-if="mostrarVisualizador" 
      class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[4000] p-4"
      @click="mostrarVisualizador = false"
    >
      <div class="relative max-w-sm w-full aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        <img :src="fotoPerfil" alt="Visualização do perfil" class="w-full h-full object-cover" />
        <button 
          @click="mostrarVisualizador = false" 
          class="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- NOME E EMAIL -->
    <div class="w-85 max-w-lg mb-8 translate-y-3/2">
      <div class="bg-white/10 backdrop-blur-md rounded-[20px] p-6 border border-white/20">
        <div class="text-center">
          <h2 class="text-1xl font-bold text-white mb-2">{{ nomeUsuario || 'Seu Nome' }}</h2>
          <p class="text-cyan-300 text-sm">{{ emailUsuario || 'seu@email.com' }}</p>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white opacity-40 transition-opacity group-hover:opacity-80">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <span class="text-[10px] font-semibold text-white opacity-40 tracking-wide group-hover:opacity-80 transition-opacity relative bottom-[5px]">Favoritos</span>
      </div>

      <!-- Perfil (Ativo) -->
      <div class="flex flex-col items-center gap-1 cursor-pointer group relative right-[5%]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-cyan-400 opacity-100 transition-opacity">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="text-[10px] font-semibold text-cyan-400 opacity-100 tracking-wide relative bottom-[5px]">Perfil</span>
      </div>
      
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)

const fotoPerfil = ref('')
const nomeUsuario = ref('')
const emailUsuario = ref('')
const favoritos = ref([])

const mostrarOpcoes = ref(false)
const mostrarVisualizador = ref(false)

onMounted(() => {
  carregarDadosPerfil()
  carregarFavoritos()
})

function carregarDadosPerfil() {
  const perfil = localStorage.getItem('perfil_usuario')
  if (perfil) {
    const dados = JSON.parse(perfil)
    fotoPerfil.value = dados.foto || ''
    nomeUsuario.value = dados.nome || ''
    emailUsuario.value = dados.email || ''
  }
}

function carregarFavoritos() {
  const favs = localStorage.getItem('favoritos')
  if (favs) {
    favoritos.value = JSON.parse(favs)
  }
}

function abrirOpcoes() {
  mostrarOpcoes.value = true
}

function escolherFoto() {
  mostrarOpcoes.value = false
  fileInput.value.click()
}

function verFoto() {
  if (fotoPerfil.value) {
    mostrarOpcoes.value = false
    mostrarVisualizador.value = true
  }
}

function selecionarFoto() {
  fileInput.value.click()
}

function handleFotoChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      fotoPerfil.value = e.target.result
      salvarPerfil()
    }
    reader.readAsDataURL(file)
  }
}

function salvarPerfil() {
  const dados = {
    foto: fotoPerfil.value,
    nome: nomeUsuario.value,
    email: emailUsuario.value
  }
  localStorage.setItem('perfil_usuario', JSON.stringify(dados))
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