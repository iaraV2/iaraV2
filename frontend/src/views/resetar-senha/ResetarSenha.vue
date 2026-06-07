<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center py-6 px-4 overflow-y-auto">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <!-- Título -->
    <div class="text-center w-full">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight relative top-4 md:top-0">Redefinir</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-2 md:top-0">nova senha</h1>
    </div>

    <!-- Conteúdo central (imagem + formulário) -->
    <div class="flex flex-col items-center justify-center w-full max-w-sm my-6">
      <img src="/img/iara.png" alt="iara" class="lg:w-100 -translate-y-44 transition-transform duration-300 w-80 relative top-10 md:top-0 lg:-top-12 md:w-64 mb-3 drop-shadow-2xl">

      <!-- FORMULÁRIO -->
      <form @submit.prevent="handleSubmit" class="relative lg:bottom-[21rem] -translate-y-[16.5rem] md:translate-y-0 w-full flex flex-col items-center gap-4">
        
        <p class="font-['Quicksand'] text-white text-center mb-2 px-2 text-sm md:text-base w-72">
          Digite o código recebido no e-mail e sua nova senha.
        </p>

        <!-- Campo do Código (Token) -->
        <input v-model="token" type="text" placeholder="Código" required alt="token" class="w-72 mx-auto h-13 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400 text-center tracking-widest" />

        <!-- Campo Nova Senha Centralizado de forma simétrica -->
        <div class="relative w-72 mx-auto">
          <input v-model="novaSenha" :type="mostrarSenha ? 'text' : 'password'" placeholder="Nova Senha" required alt="nova_senha" class="w-full h-13 rounded-full pl-10 pr-10 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400 text-center tracking-widest" />
          <button type="button" @click="mostrarSenha = !mostrarSenha" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e25300] transition-colors">
            <ToggleSenhaIcon :visivel="mostrarSenha" />
          </button>
        </div>

        <button type="submit" :disabled="carregando" alt="salvar" class="w-72 mx-auto h-13 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50">
          {{ carregando ? 'Aguarde...' : 'SALVAR SENHA' }}
        </button>

        <div class="text-center text-white font-['Quicksand'] mt-2 space-y-1" alt="links">
          <p><span @click="router.push('/login')" class="text-cyan-400 font-bold cursor-pointer hover:underline">← Voltar para o login</span></p>
        </div>
      </form>
    </div>

    <img src="/img/anjos.png" alt="anjosDigitais" class="lg:w-40 relative w-32 md:w-36 opacity-80 bottom-55 md:bottom-auto lg:-translate-y-[60%]" />

    <!-- Toast Customizado Seguro -->
    <div v-if="msg.visible" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-80 bg-black text-white p-4 rounded-lg shadow-lg flex flex-col justify-between h-20">
      <p class="text-center font-medium text-lg">{{ msg.text }}</p>
      <div class="h-1.5 rounded-full transition-all duration-1500 ease-linear" :class="msg.color" :style="{ width: msg.progress + '%' }"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ToggleSenhaIcon from '../../components/ui/ToggleSenhaIcon.vue'
import { api } from '../../services/api.js'

const router = useRouter()

const token = ref('')
const novaSenha = ref('')
const mostrarSenha = ref(false)
const carregando = ref(false)

const msg = reactive({ visible: false, text: '', color: '', progress: 100 })

function showMsg(text, color) {
  Object.assign(msg, { text, color, visible: true, progress: 100 })
  setTimeout(() => msg.progress = 0, 50)
  setTimeout(() => msg.visible = false, 1500)
}

async function handleSubmit() {
  if (novaSenha.value.length < 6) {
    showMsg('A senha precisa ter pelo menos 6 caracteres.', 'bg-red-500')
    return
  }

  carregando.value = true
  try {
    await api.post('/resetar-senha', { 
      token: token.value.trim(), 
      novaSenha: novaSenha.value
    })
    
    showMsg('Senha atualizada com sucesso!', 'bg-green-500')
    
    setTimeout(() => {
      router.push('/login')
    }, 1600)

  } catch (error) {
    console.error("Erro na requisição:", error)
    const msgErro = error.response?.data?.error || error.response?.data?.message || 'Código inválido ou erro no servidor.'
    showMsg(msgErro, 'bg-red-500')
  } finally { 
    carregando.value = false 
  }
}
</script>

<style scoped>
/* AJUSTES PARA DESKTOP (Geral) */
@media (min-width: 1024px) {
  img[alt="iara"] {
    --tw-translate-y: -7rem !important;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
  }
  form {
    --tw-translate-y: -7.5rem !important;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
    bottom: 12rem !important;
  }
  img[alt="anjosDigitais"] { bottom: 14rem !important; }
}

@media (min-width: 1200px) {
  input, button[type="submit"], p.font-\[\'Quicksand\'\].text-white, .relative.w-72.mx-auto { width: 400px !important; }
  .max-w-sm { max-width: 450px !important; }
}

/* RESTAURANDO NOTEBOOKS (1366x768) */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) { 
  h1 { font-size: 1.8em !important; bottom: 4rem !important; }
  img[alt="iara"] { width: 17rem !important; position: relative; top: 1rem !important; }
  
  /* Inputs */
  input[alt="token"] { width: 17rem !important; height: 2.5rem !important; position: relative; top: 4.8rem !important; }
  .relative.w-72.mx-auto { width: 17rem !important; height: 2.5rem !important; position: relative; top: 5.5rem !important; }
  
  p.font-\[\'Quicksand\'\] { font-size: 0.65rem !important; width: 1rem !important; position: relative; top: 5.8rem !important; }
  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 5.5rem !important; }
  button[alt="salvar"] { position: relative; top: 6.5rem !important; width: 17rem !important; height: 2.5rem !important; font-size: 15px !important; }
  img[alt="anjosDigitais"] { width: 9% !important; position: relative; bottom: 10rem !important; left: 0rem !important; }
}

input:-webkit-autofill { 
  -webkit-box-shadow: 0 0 0px 1000px white inset !important; 
  -webkit-text-fill-color: black !important; 
}
</style>