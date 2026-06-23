<template>
  <!-- Alterado min-h-screen e overflow-y-auto para h-screen e overflow-hidden para travar o scroll -->
  <div class="h-screen w-full bg-[#420583] flex flex-col items-center py-6 px-4 overflow-hidden relative">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <!-- Título -->
    <div class="text-center w-full shrink-0">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight relative top-4 md:top-0">Esqueci</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-2 md:top-0">minha senha</h1>
    </div>

    <!-- Conteúdo central (imagem + formulário) adicionado container-central -->
    <div class="flex flex-col items-center justify-center w-full max-w-sm flex-grow relative container-central">
      <img src="/img/iara.png" alt="iara" class="lg:w-100 -translate-y-44 transition-transform duration-300 w-80 relative top-10 md:top-0 lg:-top-12 md:w-64 mb-3 drop-shadow-2xl">

      <!-- FORMULÁRIO -->
      <form @submit.prevent="handleSubmit" class="relative lg:bottom-[21rem] -translate-y-[16.5rem] md:translate-y-0 w-full flex flex-col items-center gap-4">
        <p class="font-['Quicksand'] text-white text-center mb-2 px-2 text-sm md:text-base w-72 texto-ajuda">Digite seu e-mail para receber o link de recuperação.</p>
        <input v-model="email" type="email" placeholder="Seu Email" required alt="email" class="w-72 mx-auto h-13 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 focus:ring-cyan-400 placeholder:font-medium text-center placeholder:text-gray-400" />

        <button type="submit" :disabled="carregando" alt="enviar" class="w-72 mx-auto h-13 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50">
          {{ carregando ? 'Aguarde...' : 'ENVIAR LINK' }}
        </button>

        <div class="text-center text-white font-['Quicksand'] mt-2 space-y-1" alt="links">
          <p><span @click="router.push('/login')" class="text-cyan-400 font-bold cursor-pointer hover:underline">← Voltar para o login</span></p>
        </div>
      </form>
    </div>

    <!-- Rodapé adicionado rodape-anjos -->
    <div class="shrink-0 flex justify-center w-full pb-4 rodape-anjos">
      <img src="/img/anjos.png" alt="anjosDigitais" class="lg:w-40 relative w-32 md:w-36 opacity-80 bottom-55 md:bottom-auto lg:-translate-y-[60%]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api.js'
import { useToast } from 'vue-toastification'

const router = useRouter(), toast = useToast()
const email = ref(''), carregando = ref(false)

async function handleSubmit() {
  carregando.value = true
  try {
    await api.post('/esqueci-senha', { email: email.value })
    toast.success('Se o e-mail existir, um link será enviado em breve.')
    router.push('/resetar-senha')
  } catch (e) {
    toast.error('Ocorreu um erro ao tentar recuperar a senha.')
  } finally { carregando.value = false }
}
</script>

<style scoped>
:deep(html), :deep(body) {
  overflow: hidden !important;
  height: 100% !important;
  margin: 0 !important;
}

/* ==========================================
   AJUSTE ESPECÍFICO PARA TELAS PEQUENAS E CURTAS (Ex: 375x667 ou menores)
   ========================================== */
@media (max-height: 670px) and (max-width: 440px) {
  .container-central {
    justify-content: flex-start !important;
    padding-top: 0.5rem !important;
  }

  form {
    transform: none !important;
    bottom: 0 !important;
    margin-top: -2rem !important; /* Puxa o formulário sem quebrar limites */
    gap: 0.4rem !important;
  }

  .rodape-anjos {
    padding-bottom: 0.25rem !important;
  }

  h1 { 
    font-size: 1.5em !important; 
    bottom: 0 !important; 
  }

  img[alt="iara"] {
    width: 220px !important; /* Mantém a IAra destacada e proporcional */
    --tw-translate-y: 0 !important;
    transform: none !important; 
    top: -15% !important;
    position: relative;
    margin-bottom: 0rem !important;
  }

  .texto-ajuda {
    font-size: 0.8rem !important;
    position:relative;
    top:69%;
    margin-bottom: 0.2rem !important;
  }

  /* Mantém as proporções equivalentes sem empilhar 'top' residual */
  input[placeholder="Seu Email"] { 
    width: 17rem !important; 
    height: 2.5rem !important; 
    position: relative;  
    top: 65% !important;
  }
  
  /* Botão Enviar Link */
  button[alt="enviar"] { 
    position: relative; 
    top: 65% !important; 
    width: 17rem !important; 
    height: 2.5rem !important; 
    font-size: 15px !important; 
    margin-top: 0.2rem !important;
  }

  div[alt="links"] { 
    font-size: 0.8rem !important; 
    position: relative; 
    top: 65% !important; 
  }

  /* Zera o bottom forçado para que os anjos fiquem cravados na base e eliminem o scroll */
  img[alt="anjosDigitais"] {
    width: 120px !important;
    bottom: px !important;
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
  input, button[type="submit"], p.font-\[\'Quicksand\'\].text-white { width: 400px !important; }
  .max-w-sm { max-width: 450px !important; }
}

/* RESTAURANDO NOTEBOOKS (1366x768) */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) { 
  h1 { font-size: 1.8em !important; bottom: 4rem !important; }
  img[alt="iara"] { width: 17rem !important; position: relative; top: 2rem !important; }
  input[placeholder="Seu Email"] { width: 17rem !important; height: 2.5rem !important; position: relative; top: 5.8rem !important; }
  p.font-\[\'Quicksand\'\] { font-size: 0.65rem !important; width: 1rem !important; position: relative; top: 6.8rem !important; }
  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 4.2rem !important; }
  button[alt="enviar"] { position: relative; top: 5rem !important; width: 17rem !important; height: 2.5rem !important; font-size: 15px !important; }
  img[alt="anjosDigitais"] { width: 9% !important; position: relative; bottom: 10rem !important; left: 0rem !important; }
}

input:-webkit-autofill { 
  -webkit-box-shadow: 0 0 0px 1000px white inset !important; 
  -webkit-text-fill-color: black !important; 
}
</style>