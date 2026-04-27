<template>
  <div
    :class="[
      'min-h-screen bg-[#420583] flex flex-col items-center justify-between p-4 transition-all duration-1000 ease-in-out',
      saindo ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    ]"
  >
    <div class="text-center w-full mt-6 md:mt-10">
      <h1 class="text-cyan-400 font-['Passion_One'] text-5xl md:text-7xl lg:text-8xl drop-shadow-lg tracking-wide leading-tight">
        IAra sua Assistente Virtual
      </h1>
    </div>

    <div class="flex flex-col items-center flex-grow justify-center w-full max-w-lg mt-4">
      
      <div class="relative mb-2 animate-bounce">
        <div class="bg-[#e25300] text-white font-['Quicksand'] font-bold text-lg md:text-xl px-6 py-3 rounded-3xl shadow-lg relative z-10">
          Olá, eu sou a IAra!
        </div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e25300] rotate-45 z-0"></div>
      </div>

      <img
        src="/img/iara.png"
        alt="Logo IAra"
        class="w-64 md:w-80 lg:w-[400px] h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 mb-8"
      />

      <button
        @click="irParaLogin"
        :disabled="comecando"
        class="bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg md:text-xl rounded-full w-48 h-12 md:h-14 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ comecando ? 'Carregando...' : 'Entrar' }}
      </button>
    </div>

    <div class="mb-4 mt-8">
      <img
        src="/img/anjos.png"
        alt="Anjos Digitais"
        class="w-32 md:w-40 opacity-70 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const comecando = ref(false)
const saindo = ref(false)

function irParaLogin() {
  comecando.value = true
  saindo.value = true

  setTimeout(() => {
    router.push('/login')
  }, 900)
}
</script>