<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center justify-between py-6 px-4 overflow-y-auto">
    
    <div class="text-center mt-2 w-full">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight">Junte-se</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-4xl md:text-5xl leading-tight">à Comunidade</h1>
    </div>

    <div class="flex flex-col items-center justify-center flex-grow w-full max-w-sm mt-4">
      
      <div class="relative mb-2 animate-bounce">
        <div class="bg-[#e25300] text-white font-['Quicksand'] font-bold px-5 py-2 rounded-2xl shadow-lg relative z-10 animate-bounce">
          Vamos criar seu perfil!
        </div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e25300] rotate-45 z-0"></div>
      </div>

      <img src="/img/iara.png" alt="iara" class="w-48 md:w-56 mb-6 drop-shadow-2xl" />

      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4">
        <input v-model="nome" type="text" placeholder="Nome Completo" required class="w-full h-14 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400" />
        <input v-model="email" type="email" placeholder="Email" required class="w-full h-14 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400" />

        <div class="relative w-full">
          <input v-model="senha" :type="mostrarSenha ? 'text' : 'password'" placeholder="Senha" required class="w-full h-14 rounded-full pl-6 pr-12 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400" />
          <button type="button" @click="mostrarSenha = !mostrarSenha" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e25300] transition-colors">
            <svg v-if="mostrarSenha" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
          </button>
        </div>

        <button type="submit" :disabled="carregando" class="w-full h-14 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50">
          {{ carregando ? 'Cadastrando...' : 'CRIAR CONTA' }}
        </button>

        <div class="text-center text-white font-['Quicksand'] mt-2 space-y-1">
          <p>Já tem uma conta? <span @click="router.push('/login')" class="text-cyan-400 font-bold cursor-pointer hover:underline">Faça login</span></p>
        </div>
      </form>
    </div>

    <img src="/img/anjos.png" alt="anjosDigitais" class="w-32 md:w-36 mt-8 opacity-80" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const nome = ref('')
const email = ref('')
const senha = ref('')
const carregando = ref(false)
const mostrarSenha = ref(false)

async function handleSubmit() {
  carregando.value = true
  try {
    await authStore.cadastrar(nome.value, email.value, senha.value, 'Padrão')
    toast.success('Conta criada com sucesso! Faça seu login.')
    router.push('/login')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important; }
</style>