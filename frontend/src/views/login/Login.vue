<template>
  <div class="h-screen w-full bg-[#420583] flex flex-col items-center py-6 px-4 overflow-hidden relative">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">

    <div class="text-center w-full shrink-0">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight relative top-4 md:top-2">Olá,</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight relative top-2 md:top-0">Bem-vindo</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-3xl md:text-4xl leading-tight relative top-2 md:-top-1">à IAra</h1>
    </div>

    <div class="flex flex-col items-center justify-center w-full max-w-sm flex-grow relative container-central">
      <img src="/img/iara.png" alt="iara" class="lg:w-100 -translate-y-44 transition-transform duration-300 w-80 relative top-10 md:top-0 lg:-top-13 md:w-64 mb-3 drop-shadow-2xl img-iara" />

      <form @submit.prevent="handleSubmit" class="relative lg:bottom-[21rem] -translate-y-[16.5rem] md:translate-y-0 w-full flex flex-col items-center gap-4 form-login">
        <input v-model="email" type="email" placeholder="Email" required alt="email" class="w-70 mx-auto h-13 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 text-center focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400 relative z-10" />

        <div class="relative w-72 mx-auto input-senha-container">
          <input v-model="senha" :type="mostrarSenha ? 'text' : 'password'" placeholder="Senha" required alt="senha" class="w-full h-13 rounded-full pl-6 pr-12 font-['Quicksand'] text-lg text-black bg-white shadow-md outline-none focus:ring-2 text-center focus:ring-cyan-400 placeholder:font-medium placeholder:text-gray-400 relative z-10" />
          
          <button type="button" @click="mostrarSenha = !mostrarSenha" alt="mostrar_senha" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e25300] transition-colors z-20 btn-olho">
            <ToggleSenhaIcon :visivel="mostrarSenha" />
          </button>
        </div>

        <div class="w-72 mx-auto flex gap-2 mt-2 relative z-10 area-botoes">
          <button type="submit" :disabled="carregando" class="flex-1 h-13 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white font-['Quicksand'] font-bold text-lg transition-all duration-200 disabled:opacity-50">
            {{ carregando ? 'Aguarde...' : 'COMEÇAR' }}
          </button>
        </div>

        <div class="text-center text-white font-['Quicksand'] mt-2 space-y-1 links-rodape" alt="links">
          <p>Não tem conta? <span @click="router.push('/cadastro')" class="text-cyan-400 font-bold cursor-pointer hover:underline">Crie agora</span></p>
          <p>Esqueceu a senha? <span @click="router.push('/esqueci-senha')" class="text-cyan-400 font-bold cursor-pointer hover:underline">Clique aqui</span></p>
        </div>
      </form>
    </div>

    <div class="shrink-0 flex justify-center w-full pb-4 rodape-anjos">
      <img src="/img/anjos.png" alt="anjosDigitais" class="lg:w-40 relative w-32 md:w-36 opacity-80 bottom-55 md:bottom-auto lg:-translate-y-[60%]" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ToggleSenhaIcon from '../../components/ui/ToggleSenhaIcon.vue'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from 'vue-toastification'

const router = useRouter(), authStore = useAuthStore(), toast = useToast()
const email = ref(''), senha = ref(''), carregando = ref(false), mostrarSenha = ref(false)

async function handleSubmit() {
  carregando.value = true
  try {
    await authStore.login(email.value, senha.value)
    toast.success('Login realizado com sucesso!')
    
    const role = authStore.usuario?.role || 'aluno'

    if (role === 'admin') {
      router.push('/admin/dashboard') 
    } else if (role === 'professor') {
      router.push('/sala-de-aula') 
    } else {
      router.push('/menu') 
    }
    
  } catch (e) {
    const msgErro = e.response?.data?.erro || e.response?.data?.error || e.response?.data?.message || 'Email ou senha incorretos.'
    
    if (msgErro.includes('em análise') || msgErro.includes('administrador')) {
      toast.warning(msgErro, { 
        timeout: 20000,
        closeOnClick: true,
        pauseOnHover: true 
      })
    } else {
      toast.error(msgErro)
    }
  } finally { 
    carregando.value = false
  }
}
</script>

<style scoped>
/* BLOQUEIO DE SCROLL TOTAL */
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
    width: 250px !important; /* Aumenta a largura (e a altura proporcionalmente) */
    --tw-translate-y: -2rem !important;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important; 
    top: -13% !important;
    position:relative;
    margin-bottom: 0.5rem !important;
  }

  input[placeholder="Email"], input[placeholder="Senha"] { width: 17rem !important; height: 2.5rem !important; position: relative;  }
  input[placeholder="Email"] { top: 3.2rem !important; left:0px }
  input[placeholder="Senha"] { top: 3rem!important; left:9px !important; }
  svg { width: 1.2rem !important; height: 1.2rem !important; position: relative; top: 3rem !important; }
  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 3rem !important; }
  .w-72.mx-auto.flex { position: relative; top: 3rem !important; width: 17rem !important; }
  button[type="submit"] { height: 2.5rem !important; font-size: 15px !important;position:relative; top: 0rem!important }
  img[alt="anjosDigitais"] {
    width: 120px !important;
    bottom: 8.4rem !important;
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
  input, .relative.w-72.mx-auto { width: 400px !important; }
  .w-72.mx-auto.flex { width: 400px !important; }
  .max-w-sm { max-width: 450px !important; }
  
  input[type="radio"] {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    flex-shrink: 0 !important;
  }
}

/* RESTAURANDO NOTEBOOKS (1366x768) */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) { 
  h1 { font-size: 1.8em !important; bottom: 4rem !important; }
  img[alt="iara"] { width: 17rem !important; position: relative; top: -1rem !important; }
  input[placeholder="Email"], input[placeholder="Senha"] { width: 17rem !important; height: 2.5rem !important; position: relative; }
  input[placeholder="Email"] { top: 3.5rem !important; }
  input[placeholder="Senha"] { top: 2.7rem !important; left: 4rem !important; }
  svg { width: 1.2rem !important; height: 1.2rem !important; position: relative; top:2.7rem !important; left: -4rem; }
  div[alt="links"] { font-size: 0.8rem !important; position: relative; top: 1.2rem !important; }
  .w-72.mx-auto.flex { position: relative; top: 2.3rem !important; width: 17rem !important; }
  button[type="submit"] { height: 2.5rem !important; font-size: 15px !important; }
  img[alt="anjosDigitais"] { width: 9% !important; position: relative; bottom: 15rem !important; left: 0rem !important; }
}

input:-webkit-autofill { 
  -webkit-box-shadow: 0 0 0px 1000px white inset !important; 
  -webkit-text-fill-color: black !important; 
}

@media (max-height: 600px) {
  .gap-4 { gap: 0.5rem !important; }
}
</style>