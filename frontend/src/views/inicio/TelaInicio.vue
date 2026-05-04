<template>
  <div :class="['min-h-screen bg-[#420583] flex flex-col items-center justify-between p-4 transition-all duration-1000 ease-in-out', saindo ? 'opacity-0 scale-95' : 'opacity-100 scale-100']">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
    
    <div class="text-center w-full mt-6 md:mt-10">
      <h1 class="text-white font-['Quicksand'] text-5xl sm:text-4xl md:text-4xl lg:text-6xl font-bold drop-shadow-lg tracking-wide leading-tight mt-12 md:mt-0">IAra</h1>
    </div>

    <div class="flex flex-col items-center flex-grow justify-center w-full max-w-lg mt-4">      
      <div class="relative mb-8 animate-thought-in">
        <div class="animate-float">
          <div class="lg:w-[13.5rem] lg:translate-y-25 lg:-translate-x-22 bg-[#e25300] text-white font-['Quicksand'] text-lg font-semibold px-12 py-6 rounded-[40px] shadow-2xl relative z-10 break-words max-w-[95%] md:max-w-lg mx-auto text-center border-2 border-white/20 translate-y-19 -translate-8" alt="Balão de pensamento">Eu sou a IAra,<br> sua assistente virtual!</div>  
          <div alt="cauda do balao" class="absolute -bottom-34 md:-bottom-40 left-[7%] -translate-x-2/2 flex flex-col items-start gap-1 z-20">
            <div class="w-5 h-5 bg-[#e25300] rounded-full shadow-lg border-2 border-white/10"></div>
            <div class="w-4 h-4 bg-[#e25300] rounded-full left-[10%] shadow-md ml-2 border-2 border-white/10"></div>
            <div class="w-2.5 h-2.5 bg-[#e25300] rounded-full left-[40%] shadow-sm ml-6 border-2 border-white/10"></div>
          </div>
        </div>
      </div>
      <img src="/img/iara.png" alt="Logo IAra" class="w-85 md:w-80 lg:w-[22rem] xl:w-[25rem] h-auto drop-shadow-2xl hover:scale-105 transition-all duration-500 mb-4 -translate-y-20 md:-translate-y-16 lg:-translate-y-18 xl:-translate-y-24" />
      <button @click="irParaLogin" :disabled="comecando" class="bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg lg:bottom-69 md:text-xl rounded-full w-33 h-12 md:h-12 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed -translate-y-55 md:translate-y-0">
        {{ comecando ? 'Carregando...' : 'Entrar' }}
      </button>
    </div>
    <div class="mb-4 mt-8">
      <img src="/img/anjos.png" alt="Anjos Digitais" class="w-32 md:w-36 lg:w-[13rem] opacity-70 hover:opacity-100 transition-opacity duration-300 -translate-y-30 md:translate-y-0 lg:-translate-y-24" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter(), comecando = ref(false), saindo = ref(false)

function irParaLogin() {
  comecando.value = saindo.value = true
  setTimeout(() => router.push('/login'), 900)
}
</script>

<style scoped>
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) { 
  h1 { font-size: 2.8em !important; top: 4rem !important; }
  button { top: -22rem !important; width: 8rem !important; height: 2.7rem !important; font-size: 15px !important; }
  div[alt="Balão de pensamento"] { width: 13.5rem !important; position: relative; right: 48% !important; height: auto !important; }
  div[alt="cauda do balao"] { width: 2.5rem !important; position: relative; left: -2% !important; bottom: -6.5rem !important; transform:rotate(-30deg) }
  img[alt="Logo IAra"] { width: 20rem !important; position: relative; top: -6rem !important; }
  img[alt="Anjos Digitais"] { width: 9% !important; position: relative; bottom: 10rem !important; left: 38rem !important; }  
}
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-float { animation: float 4s ease-in-out infinite; }
.animate-thought-in { animation: fadeInScale 0.8s ease-out forwards; }
.bg-\[\#e25300\] { position: relative; overflow: hidden; }
.bg-\[\#e25300\]::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none; }
</style>
