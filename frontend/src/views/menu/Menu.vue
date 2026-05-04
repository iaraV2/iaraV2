<template>
  <div class="menu-container fixed top-0 left-0 w-full h-screen flex flex-col bg-[#380075] overflow-hidden z-[999]">
    <button @click="voltarLogin" class="btnVoltar absolute top-5 right-5 z-[1000] bg-black/20 border border-aqua text-white py-2 px-4 rounded-[20px] cursor-pointer font-['Quicksand'] font-bold hover:bg-aqua hover:text-[#380075] transition-colors">⬅ Sair</button>

    <div class="metadeSuperior flex-[1] h-1/2 w-full flex flex-col items-center justify-center relative">
      <div class="saudacaoContainer text-center z-10 -mb-[100px] animate-fadeIn">
        <h1 class="textoSaudacao font-['Quicksand'] text-white font-light text-[2rem] m-0">Olá, <span class="nomeDestaque text-aqua font-bold capitalize">{{ nomeUsuario }}</span>!</h1>
        <p class="subtextoSaudacao font-['Quicksand'] text-[#e0e0e0] text-base mt-[5px]">Como posso te ajudar hoje?</p>
      </div>
      <img src="/img/iara.png" alt="Logo IAra" class="logoIaraMenu h-[60vh] w-auto -mb-[200px] -mt-[45px] object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
    </div>

    <div class="estruturaInferior h-1/2 w-full bg-[#f0f4f8] rounded-t-[40px] flex justify-center items-center p-5 box-border">
      <div class="grid-cards grid grid-cols-2 grid-rows-2 gap-[15px] w-full max-w-[600px] h-[90%]">
        <div v-for="card in cards" :key="card.titulo" @click="irPara(card.rota)" class="card-item bg-white rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-[#fffaf0] text-center p-2.5">
          <component :is="card.iconIsImg ? 'img' : (card.iconIsSvg ? 'svg' : 'i')" v-bind="card.iconProps" :class="card.iconClass" />
          <h6 class="card-titulo text-[#440d72] font-['Quicksand'] font-bold text-[0.9rem] mt-2">{{ card.titulo }}</h6>
        </div>
      </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter(), authStore = useAuthStore()
const nomeUsuario = computed(() => authStore.usuario?.nome || 'Visitante')

const cards = [
  { titulo: 'Empreender', rota: '/empreender', iconIsImg: true, iconProps: { src: 'https://i.ibb.co/n8kWgnmt/Icon-symbolizing-entrepreneurship-and-innovation.png', alt: 'Empreender' }, iconClass: 'h-10 w-auto' },
  { titulo: 'Dicas de Inclusão Digital', rota: '/dicas', iconClass: 'fa-regular fa-lightbulb text-[2.5rem] text-[#ff7300]' },
  { titulo: 'Sala de Aula', rota: '/sala-de-aula', iconClass: 'fa-solid fa-book text-[2.5rem] text-[#ff7300]' },
  { titulo: 'Iniciar uma Conversa', rota: '/chat', iconIsSvg: true, iconClass: 'w-10 h-10 text-[#ff7300]', iconProps: { viewBox: '0 0 16 16', fill: 'currentColor', innerHTML: '<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>' } }
]

const irPara = (rota) => router.push(rota)
const voltarLogin = () => authStore.logout()
</script>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fadeIn { animation: fadeIn 1s ease-out; }

@media (max-width: 639px) {
  .textoSaudacao { font-size: 1.5rem !important; position: relative; top: 3rem !important; }
  .subtextoSaudacao { font-size: 0.9rem !important; position: relative; top: 3rem !important;}
  .metadeSuperior { padding-top: 20px !important; }
  .logoIaraMenu { height: 57vh !important; margin-bottom: -20px !important; margin-top: -40px !important; }
  .grid-cards { gap: 10px !important; }
  .card-item { padding: 8px !important; }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .textoSaudacao { font-size: 1.8rem !important; }
  .logoIaraMenu { height: 55vh !important; }  
  .grid-cards { max-width: 500px !important; }
}

@media (min-width: 1024px) {
  .textoSaudacao { font-size: 1.5rem !important; position: relative; top: 3.5rem !important; }
  .subtextoSaudacao { position: relative; top: 3rem !important; } 
  .grid-cards { grid-template-columns: repeat(4, 1fr) !important; grid-template-rows: 1fr !important; max-width: 1000px !important; height: auto !important; padding: 40px !important; }
  .card-item { height: 200px !important; }
}

.border-aqua { border-color: aqua; }
.text-aqua { color: aqua; }
</style>
