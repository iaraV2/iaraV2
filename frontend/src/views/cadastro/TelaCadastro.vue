<template>
  <!-- Removido 'scroll-pequeno' para travar o overflow rigidamente -->
  <div class="h-screen w-full bg-[#420583] flex flex-col items-center py-6 px-4 overflow-hidden relative">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <!-- Título -->
    <div class="text-center w-full shrink-0">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight relative top-4 md:top-3">Junte-se</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-2 md:top-1">à Comunidade</h1>
    </div>

    <!-- Conteúdo central (imagem + formulário) -->
    <div class="flex flex-col items-center justify-center w-full max-w-sm flex-grow relative container-central">
      <img src="/img/iara.png" alt="iara" class="lg:w-100 -translate-y-44 transition-transform duration-300 w-80 relative top-10 md:top-0 lg:-top-17.5 md:w-64 mb-3 drop-shadow-2xl" />

      <!-- FORMULÁRIO -->
      <form @submit.prevent="handleSubmit" class="relative lg:-top-[14.5rem]  -translate-y-[16.5rem] md:translate-y-0 w-full flex flex-col items-center gap-4">
        <input v-model="nome" type="text" placeholder="Nome Completo" required alt="nome" class="w-70 mx-auto h-13 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium text-center placeholder:text-gray-400" />
        <input v-model="email" type="email" placeholder="Email" required alt="email" class="w-70 mx-auto h-13 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium text-center placeholder:text-gray-400 relative z-10" />
        
        <div class="relative w-72 mx-auto bloco-senha">
          <input v-model="senha" :type="mostrarSenha ? 'text' : 'password'" placeholder="Senha" required alt="senha" class="w-full h-13 rounded-full pl-6 pr-12 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium text-center placeholder:text-gray-400" />
          <button type="button" @click="mostrarSenha = !mostrarSenha" alt="mostrar_senha" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e25300] transition-colors">
            <ToggleSenhaIcon :visivel="mostrarSenha" />
          </button>
        </div>

        <!-- Botão de submissão -->
        <button type="submit" :disabled="carregando" alt="cadastrar" class="w-72 mx-auto h-13 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50">
          {{ carregando ? 'Aguarde...' : 'CRIAR CONTA' }}
        </button>

        <!-- Opções de Professor/Aluno -->
        <div class="flex items-center justify-center gap-6 w-70 mx-auto py-1 area-roles">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative flex items-center justify-center shrink-0">
              <input type="radio" v-model="role" value="professor" name="userRole" class="peer appearance-none w-5 h-5 border-2 border-white rounded-full checked:border-cyan-400 transition-all cursor-pointer lg:w-6 lg:h-6" required>
              <div class="absolute w-3 h-3 bg-cyan-400 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200 lg:w-4 lg:h-4"></div>
            </div>
            <span class="text-white font-['Quicksand'] text-base md:text-lg whitespace-nowrap">Professor</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative flex items-center justify-center shrink-0">
              <input type="radio" v-model="role" value="aluno" name="userRole" class="peer appearance-none w-5 h-5 border-2 border-white rounded-full checked:border-cyan-400 transition-all cursor-pointer lg:w-6 lg:h-6" required>
              <div class="absolute w-3 h-3 bg-cyan-400 rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200 lg:w-4 lg:h-4"></div>
            </div>
            <span class="text-white font-['Quicksand'] text-base md:text-lg whitespace-nowrap">Aluno</span>
          </label>
        </div>

        <div class="text-center text-white font-['Quicksand'] mt-2 space-y-1" alt="links">
          <p>Já tem uma conta? <span @click="router.push('/login')" class="text-cyan-400 font-bold cursor-pointer hover:underline">Faça login</span></p>
        </div>
      </form>
    </div>

    <!-- Rodapé -->
    <div class="shrink-0 flex justify-center w-full pb-4 rodape-anjos">
      <img src="/img/anjos.png" alt="anjosDigitais" class="lg:w-40 relative w-32 md:w-36 opacity-80 bottom-55 md:bottom-auto lg:-translate-y-[120%]" />
    </div>

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
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const nome = ref(''), email = ref(''), senha = ref(''), role = ref('aluno')
const carregando = ref(false), mostrarSenha = ref(false)
const msg = reactive({ visible: false, text: '', color: '', progress: 100 })

function showMsg(text, color) {
  Object.assign(msg, { text, color, visible: true, progress: 100 })
  setTimeout(() => msg.progress = 0, 50)
  setTimeout(() => msg.visible = false, 2500) 
}

async function handleSubmit() {
  carregando.value = true
  try {
    await authStore.cadastrar(nome.value, email.value, senha.value, 'Padrão', role.value)
    
    if (role.value === 'professor') {
      showMsg('Solicitação enviada! Aguarde a aprovação de um Administrator.', 'bg-blue-500')
      setTimeout(() => router.push('/login'), 2600)
    } else {
      showMsg('Usuário cadastrado com sucesso!', 'bg-green-500')
      setTimeout(() => router.push('/login'), 1600)
    }
    
  } catch (e) {
    const err = e.response?.data?.message?.toLowerCase() || ''
    showMsg(err.includes('já') || err.includes('exist') ? 'Usuário já cadastrado' : 'Erro ao cadastrar', 'bg-red-500')
  } finally { carregando.value = false }
}
</script>

<style scoped>
:deep(html), :deep(body) {
  overflow: hidden !important;
  height: 100% !important;
}

/* ==========================================
   AJUSTE ESPECÍFICO PARA TELAS PEQUENAS E CURTAS (Ex: 375x667 ou menores)
   ========================================== */
@media (max-height: 670px) and (max-width: 440px) {
  .container-central {
    justify-content: flex-start !important;
    padding-top: 1rem !important;
  }

  form {
    transform: none !important;
    bottom: 0 !important;
    gap: 0.5rem !important;
  }

  .rodape-anjos {
    padding-bottom: 0.5rem !important;
  }

  h1 { font-size: 1.5em !important; bottom: 4rem !important; }

  img[alt="iara"] {
    width: 250px !important; 
    --tw-translate-y: -2rem !important;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important; 
    top: -13% !important;
    position: relative;
    margin-bottom: 0.5rem !important;
  }

  input[placeholder="Nome Completo"], input[placeholder="Email"], input[placeholder="Senha"] { 
    width: 17rem !important; 
    height: 2.5rem !important; 
    position: relative;  
  }
  
  input[placeholder="Nome Completo"] { top: 3.4rem !important; left: 0px; }
  input[placeholder="Email"] { top: 3.2rem !important; left: 0px; }
  input[placeholder="Senha"] { top: 3rem !important; left: 9px !important; }
  
  svg { width: 1.2rem !important; height: 1.2rem !important; position: relative; top: 3rem !important; }
  
  button[alt="cadastrar"] { 
    position: relative; 
    top: 3rem !important; 
    width: 17rem !important; 
    height: 2.5rem !important; 
    font-size: 15px !important; 
    margin-top: 0rem !important;
  }

  .area-roles {
    position: relative;
    top: 3rem !important;
  }

  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 3rem !important; }

  img[alt="anjosDigitais"] {
    width: 120px !important;
    bottom: 10.4rem !important;
    transform: none !important;
  }
}

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

/* DESKTOPS GRANDES */
@media (min-width: 1200px) {
  input[type="text"], input[type="email"], input[type="password"], button[type="submit"], .relative.w-72.mx-auto { width: 400px !important; }
  .max-w-sm { max-width: 450px !important; }
}

/* ==========================================
   RESTAURANDO NOTEBOOKS (1366x768) - ADAPTADO E CORRIGIDO
   ========================================== */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) { 
  h1 { font-size: 1.8em !important; bottom: 4rem !important; }
  img[alt="iara"] { width: 17rem !important; position: relative; top: -1rem !important; }
  
  /* Ajuste dos inputs principais */
  input[type="text"], input[type="email"], input[type="password"] { width: 17rem !important; height: 2.5rem !important; position: relative; }
  input[alt="nome"] { top: 6rem !important; }
  input[placeholder="Email"] { top: 5.4rem !important; }
  
  /* Ajuste do container e do input de senha */
  .bloco-senha { width: 17rem !important; position: relative; top: 4.8rem !important; left: 4rem !important; }
  .bloco-senha input { width: 68% !important; height: 2.5rem !important; }
  
  /* Ajuste do botão com o ícone de olho */
  .bloco-senha button { top: 50% !important; transform: translateY(-50%) !important; right: 1rem !important; }
  svg { width: 1.2rem !important; height: 1.2rem !important; position: relative; top: 0.5rem !important; left: -8.3rem !important; }
  
  /* Demais componentes e botões inferiores */
  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 2.2rem !important; }
  /* AREA ROLES BEM MENOR */
  .area-roles { 
    position: relative; 
    top: 3.4rem !important; 
    width: 10rem !important; 
    gap: 0.5rem !important; 
  }
  .texto-role { 
    font-size: 0.75rem !important; 
  }
  .area-roles input[type="radio"] {
    width: 0.9rem !important;
    height: 0.9rem !important;
  }
  .area-roles .bg-cyan-400 {
    width: 0.5rem !important;
    height: 0.5rem !important;
  }
  button[type="submit"] { position: relative; top: 4.3rem !important; width: 17rem !important; height: 2.5rem !important; font-size: 15px !important; }
  img[alt="anjosDigitais"] { width: 9% !important; position: relative; bottom: 15rem !important; left: 0rem !important; }
}

input:-webkit-autofill { 
  -webkit-box-shadow: 0 0 0px 1000px white inset !important; 
  -webkit-text-fill-color: black !important; 
}
</style>