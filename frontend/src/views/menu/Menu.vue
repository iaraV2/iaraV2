<template>
  <div class="menu-container fixed top-0 left-0 w-full h-screen flex flex-col bg-[#380075] overflow-y-auto z-[999]">
    
    <!-- BOTÃO VOLTAR SOFISTICADO - BORDA TRANSPARENTE -->
<button
  type="button"
  @click="modal.visible = true"
  class="fixed top-12 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 "
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="m15 18-6-6 6-6"/>
  </svg>
</button>

    <!-- Modal Reativo Customizado -->
    <div v-if="modal.visible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-8 w-85 h-22 shadow-2xl text-center">
        <h3 class="font-['Quicksand'] font-bold text-[#420583] text-2xl mb-2">Sair da conta?</h3>
        <p class="font-['Quicksand'] text-gray-500 text-sm mb-6">Tem certeza que deseja se desconectar da IAra?</p>
        <div class="flex justify-center gap-3">
<button @click="modal.visible = false" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">Não</button>
<button @click="efetuarLogout" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-white bg-[#e25300] hover:bg-[#ff7b00] transition-colors">Sim, Sair</button>
        </div>
      </div>
    </div>

    <!-- Metade superior -->
    <div class="metadeSuperior flex-shrink-0 min-h-[45%] w-full flex flex-col items-center justify-center relative overflow-visible">
      <div class="saudacaoContainer text-center z-10 animate-fadeIn">
        <h1 class="textoSaudacao font-['Quicksand'] text-white font-light text-[2rem] m-0">
          Olá, <span class="nomeDestaque text-aqua font-bold capitalize">{{ nomeUsuario }}</span>!
        </h1>
        <p class="subtextoSaudacao font-['Quicksand'] text-[#e0e0e0] text-base mt-[5px]">
          Como posso te ajudar hoje?
        </p>
      </div>
      <img src="/img/iara.png" alt="Logo IAra" class="logoIaraMenu w-56 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
    </div>

    <!-- Metade inferior - Ajustada com flex-grow para eliminar margem no fim -->
    <div class="estruturaInferior flex-grow w-full bg-[#f0f4f8] rounded-t-[40px] flex justify-center items-center p-5 box-border">
      <div class="grid-cards grid grid-cols-2 gap-[15px] w-full max-w-[600px]">
        <div v-for="card in cards" :key="card.titulo" @click="irPara(card.rota)" class="card-item bg-white rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-[#fffaf0] text-center p-2.5">
          <component :is="card.iconIsImg ? 'img' : (card.iconIsSvg ? 'svg' : 'i')" v-bind="card.iconProps" :class="card.iconClass" />
          <h6 class="card-titulo text-[#440d72] font-['Quicksand'] font-bold text-[0.9rem] mt-2">
            {{ card.titulo }}
          </h6>
        </div>
      </div>
    </div>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter(), authStore = useAuthStore()
const nomeUsuario = computed(() => authStore.usuario?.nome || 'Visitante')

const modal = reactive({ visible: false })

const efetuarLogout = () => {
  modal.visible = false
  authStore.logout()
}

const cards = [
  { titulo: 'Empreender', rota: '/empreender', iconIsImg: true, iconProps: { src: 'https://i.ibb.co/n8kWgnmt/Icon-symbolizing-entrepreneurship-and-innovation.png', alt: 'Empreender' }, iconClass: 'h-10 w-auto' },
  { titulo: 'Dicas de Inclusão Digital', rota: '/dicas', iconClass: 'fa-regular fa-lightbulb text-[2.5rem] text-[#ff7300]' },
  { titulo: 'Sala de Aula', rota: '/sala-de-aula', iconClass: 'fa-solid fa-book text-[2.5rem] text-[#ff7300]' },
  { titulo: 'Iniciar uma Conversa', rota: '/chat', iconIsSvg: true, iconClass: 'w-10 h-10 text-[#ff7300]', iconProps: { viewBox: '0 0 16 16', fill: 'currentColor', innerHTML: '<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>' } }
]

const irPara = (rota) => {
  if (rota === '/empreender' || rota === '/dicas') return
  router.push(rota)
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

.border-aqua { border-color: aqua; }
.text-aqua   { color: aqua; }

/* Efeito de movimento no hover do botão */
button.fixed:hover svg {
  transform: translateX(-2px);
  transition: transform 0.2s ease;
}

button.fixed svg {
  transition: transform 0.2s ease;
}

/* ── Mobile pequeno (< 640px) ─────────────────────────────────── */
@media (max-width: 639px) {
  .textoSaudacao    { font-size: 1.5rem; }
  .subtextoSaudacao { font-size: 0.9rem; }
  .logoIaraMenu {
    height: 38vh;
    margin-top: -10px;
    margin-bottom: -60px; 
  }
  .grid-cards { gap: 10px; }
  .card-item  { padding: 8px; min-height: 80px; }
  .card-titulo { font-size: 0.78rem; }
}

/* ── Tablet e Notebook Pequeno (640px – 1023px) ────────────────── */
@media (min-width: 640px) and (max-width: 1023px) {
  .textoSaudacao { font-size: 1.8rem; }
  .logoIaraMenu  {
    height: 48vh;
    margin-bottom: -100px;
  }
  .grid-cards { 
    max-width: 500px; 
    grid-template-columns: repeat(2, 1fr); 
  }
}

/* ── Desktop (≥ 1024px) ───────────────────────────────────────── */
@media (min-width: 1024px) {
  .saudacaoContainer { margin-bottom: -60px; } 
  .logoIaraMenu {
    height: 55vh;
    margin-bottom: -160px; 
  }
  .grid-cards {
    grid-template-columns: repeat(2, 1fr) !important;
    grid-template-rows: repeat(2, 1fr) !important;
    max-width: 800px;
    padding: 20px;
    gap: 25px; 
  }
  .card-item { height: 200px; }
}
</style>