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
    <BackButton
      button-class="fixed top-5 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="router.back()"
    />

    <div class="mt-16 mb-6 flex flex-col items-center">
      <div class="relative">
        <div
          class="w-32 h-32 translate-y-1/3 rounded-full border-4 border-cyan-400 overflow-hidden bg-[#1a064e] flex items-center justify-center cursor-pointer shadow-xl"
          @click="abrirOpcoes"
        >
          <img v-if="fotoPerfil" :src="fotoPerfil" alt="Foto de perfil" class="w-full h-full object-cover" />
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
        <input ref="fileInput" type="file" accept="image/*" @change="handleFotoChange" class="hidden" />
      </div>
    </div>

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
            class="w-[60%] relative left-[20%] py-3 px-4 bg-white/10 border border-white/15 rounded-xl font-semibold text-sm text-white transition-all hover:bg-white/20 active:scale-98 disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed"
          >
            Ver foto
          </button>
          <button
            @click="escolherFoto"
            class="w-[60%] relative left-[20%] py-3 px-4 bg-cyan-400 rounded-xl font-bold text-sm text-[#420583] shadow-md transition-all hover:bg-cyan-300 hover:scale-[1.02] active:scale-98"
          >
            Escolher foto
          </button>
        </div>
        <button @click="mostrarOpcoes = false" class="text-white/40 hover:text-white/80 text-xs font-semibold mt-1 transition-colors">Cancelar</button>
      </div>
    </div>

    <div
      v-if="mostrarVisualizador"
      class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[4000] p-4"
      @click="mostrarVisualizador = false"
    >
      <div class="relative max-w-sm w-full aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        <img :src="fotoPerfil" alt="Visualização do perfil" class="w-full h-full object-cover" />
        <button @click="mostrarVisualizador = false" class="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white text-lg font-bold">✕</button>
      </div>
    </div>

    <div class="w-85 max-w-lg mb-8 translate-y-3/2">
      <div class="bg-white/10 backdrop-blur-md rounded-[20px] p-6 border border-white/20">
        <div class="text-center">
          <h2 class="text-1xl font-bold text-white mb-2">{{ nomeUsuario || 'Seu Nome' }}</h2>
          <p class="text-cyan-300 text-sm">{{ emailUsuario || 'seu@email.com' }}</p>
        </div>
      </div>
    </div>

    <SalaBottomNav aba-ativa="perfil" rotulo-favoritos="Favoritos" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import SalaBottomNav from '../../components/sala/SalaBottomNav.vue'

const router = useRouter()
const fileInput = ref(null)
const fotoPerfil = ref('')
const nomeUsuario = ref('')
const emailUsuario = ref('')
const mostrarOpcoes = ref(false)
const mostrarVisualizador = ref(false)

// ─── Chave isolada por role ────────────────────────────────────────────────────
const roleUsuario = ref('aluno')

const chaveStorage = computed(() =>
  roleUsuario.value === 'professor' ? 'perfil_professor' : 'perfil_aluno'
)

onMounted(() => {
  // 1. Lê o usuário logado — authStore salva em 'iara_usuario'
  try {
    const usuarioRaw = localStorage.getItem('iara_usuario')
    if (usuarioRaw) {
      const usuario = JSON.parse(usuarioRaw)
      roleUsuario.value  = usuario.role  || 'aluno'
      nomeUsuario.value  = usuario.nome  || ''
      emailUsuario.value = usuario.email || ''
    }
  } catch {
    roleUsuario.value = 'aluno'
  }

  // 2. Sobrescreve com o perfil personalizado da role correta (foto, nome editado)
  try {
    const perfilRaw = localStorage.getItem(chaveStorage.value)
    if (perfilRaw) {
      const dados = JSON.parse(perfilRaw)
      fotoPerfil.value   = dados.foto  || ''
      nomeUsuario.value  = dados.nome  || nomeUsuario.value
      emailUsuario.value = dados.email || emailUsuario.value
    }
  } catch {
    // localStorage corrompido — mantém dados do login
  }
})

function abrirOpcoes() { mostrarOpcoes.value = true }
function escolherFoto() { mostrarOpcoes.value = false; fileInput.value.click() }
function verFoto() {
  if (fotoPerfil.value) { mostrarOpcoes.value = false; mostrarVisualizador.value = true }
}
function handleFotoChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { fotoPerfil.value = e.target.result; salvarPerfil() }
  reader.readAsDataURL(file)
}

// Salva sempre na chave isolada da role atual
function salvarPerfil() {
  localStorage.setItem(chaveStorage.value, JSON.stringify({
    foto:  fotoPerfil.value,
    nome:  nomeUsuario.value,
    email: emailUsuario.value,
  }))
}
</script>