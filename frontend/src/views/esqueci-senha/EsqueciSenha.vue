<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center justify-between py-6 px-4 overflow-y-auto">
    
    <div class="text-center mt-2 w-full mb-4">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-4xl md:text-5xl leading-tight">Esqueci</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-4xl md:text-5xl leading-tight">minha senha</h1>
    </div>

    <div class="flex flex-col items-center justify-center w-full max-w-sm mt-2 md:mt-6">
      
      <div class="relative mb-4 animate-bounce">
        <div class="bg-[#e25300] text-white font-['Quicksand'] font-bold text-sm md:text-base px-5 py-2 rounded-2xl shadow-lg relative z-10 text-center">
          Esqueceu? Eu te ajudo!
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e25300] rotate-45 z-0"></div>
      </div>
      
      <img src="/img/iara.png" alt="iara" class="w-48 sm:w-56 md:w-64 drop-shadow-2xl relative z-10" />
    </div>

    <p class="font-['Quicksand'] text-white text-center mt-4 mb-10 max-w-sm px-2 text-sm md:text-base">
      Digite o e-mail cadastrado. Vamos te enviar um link para criar uma nova senha.
    </p>

    <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4 max-w-sm">
      <input
        v-model="email"
        type="email"
        placeholder="Seu Email"
        required
        class="w-full h-14 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400"
      />

      <button 
        type="submit" 
        :disabled="carregando" 
        class="w-full h-14 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50"
      >
        {{ carregando ? 'Enviando...' : 'ENVIAR LINK' }}
      </button>

      <div class="text-center text-white font-['Quicksand'] mt-4 space-y-1">
        <p>
          <span @click="router.push('/login')" class="text-cyan-400 font-bold cursor-pointer hover:underline">
            ← Voltar para o login
          </span>
        </p>
      </div>
    </form>

    <img src="/img/anjos.png" alt="anjosDigitais" class="w-32 md:w-36 mt-8 opacity-80" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api.js'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const email = ref('')
const carregando = ref(false)

async function handleSubmit() {
  carregando.value = true
  try {
    await api.post('/usuarios/esqueci-senha', { email: email.value })
    toast.success('Se o e-mail existir, um link será enviado em breve.')
    router.push('/login')
  } catch (error) {
    toast.error('Ocorreu um erro ao tentar recuperar a senha.')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>

input:-webkit-autofill { 
  -webkit-box-shadow: 0 0 0px 1000px white inset !important; 
  -webkit-text-fill-color: black !important; 
}
</style>