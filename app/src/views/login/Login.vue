<template>
  <div
    :class="[
      'fixed top-0 left-0 w-screen h-screen bg-[#420583] z-[9999]',
      'flex flex-col items-center justify-between',
      'py-[15px] overflow-hidden transition-opacity duration-[800ms]',
      visivel ? 'opacity-100' : 'opacity-0',
      'max-[768px]:justify-start max-[768px]:pt-[50px]'
    ]"
  >
    <!-- TÍTULOS -->
    <div class="text-center mt-[20px] z-[100]">
      <h1
        class="
          font-['Quicksand'] text-cyan-400 m-0 leading-[1.1] font-light
          text-[2.5rem]
          min-[1367px]:max-[1600px]:text-[2.2rem]
          min-[1025px]:max-[1366px]:text-[2rem]
          max-[768px]:text-[1.5rem] max-[768px]:-translate-y-[3.5rem]
        "
      >
        Olá,
      </h1>
      <h1
        class="
          font-['Quicksand'] text-cyan-400 m-0 leading-[1.1] font-light
          text-[2rem]
          min-[1367px]:max-[1600px]:text-[1.8rem]
          min-[1025px]:max-[1366px]:text-[1.6rem]
          max-[768px]:text-[1.5rem] max-[768px]:-translate-y-[3.5rem]
        "
      >
        Bem-vindo
      </h1>
      <h1
        class="
          font-['Quicksand'] text-cyan-400 m-0 leading-[1.1] font-bold
          text-[2rem]
          min-[1367px]:max-[1600px]:text-[1.5rem]
          min-[1025px]:max-[1366px]:text-[1.6rem]
          max-[768px]:text-[1.5rem] max-[768px]:-translate-y-[3.5rem]
        "
      >
        à IAra
      </h1>
    </div>

    <!-- LOGO IARA -->
    <img
      src="/img/iara.png"
      alt="iara"
      class="
        h-auto object-contain z-[5] my-[10px]
        [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))]
        w-[25%] -translate-y-[14.8em]
        min-[1367px]:max-[1600px]:w-[22%] min-[1367px]:max-[1600px]:-translate-y-[13em]
        min-[1025px]:max-[1366px]:w-[20%] min-[1025px]:max-[1366px]:-translate-y-[11em]
        min-[769px]:max-[1024px]:w-[35%]
        max-[768px]:w-[85%] max-[768px]:max-w-[280px] max-[768px]:-translate-y-[12rem]
      "
    />

    <!-- FORMULÁRIO -->
    <form
      @submit.prevent="handleSubmit"
      class="
        flex flex-col items-center w-full z-[10] px-[20px]
        max-w-[380px] -translate-y-[28.5rem]
        min-[1367px]:max-[1600px]:-translate-y-[26rem]
        min-[1025px]:max-[1366px]:-translate-y-[22rem] min-[1025px]:max-[1366px]:max-w-[340px]
        min-[769px]:max-[1024px]:-translate-y-[24rem]
        max-[768px]:w-[90%] max-[768px]:max-w-[320px] max-[768px]:-translate-y-[20rem]
      "
    >
      <!-- INPUT EMAIL -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="
          w-full h-[55px] rounded-[30px] border-none outline-none
font-['Quicksand'] text-[1rem] placeholder:pl-[15px]
          bg-[rgb(253,251,251)] text-black
          shadow-[2px_2px_5px_rgba(0,0,0,0.2)]
          p-[15px] mb-[12px]
          focus:bg-white
          max-[768px]:p-[12px] max-[768px]:text-[0.95rem] max-[768px]:mb-[8px]
        "
      />

      <!-- INPUT SENHA -->
      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        required
        class="
          w-full h-[55px] rounded-[30px] border-none outline-none
          font-['Quicksand'] text-[1rem] placeholder:pl-[15px] 
          bg-[rgb(253,251,251)] text-black
          
          shadow-[2px_2px_5px_rgba(0,0,0,0.2)]
          top-[5.5px] relative
          p-[15px] mb-[12px]
          focus:bg-white
          max-[768px]:p-[12px] max-[768px]:text-[0.95rem] max-[768px]:mb-[8px]
        "
      />

      <!-- BOTÃO COMEÇAR -->
      <button
        type="submit"
        class="
          w-full h-[55px] p-[15px] rounded-[30px] border-none cursor-pointer
          bg-[#e25300] text-[#f4f4f5] font-['Quicksand']
          top-[17px] relative
          font-medium text-[1.1rem] leading-[1]
          transition-[transform,background-color] duration-200
          hover:bg-[#ff7b00] hover:scale-[1.02]
          min-[1025px]:max-[1366px]:p-[12px] min-[1025px]:max-[1366px]:text-[1rem]
          max-[768px]:p-[12px] max-[768px]:text-white max-[768px]:mt-[5px] max-[768px]:text-[1rem]
        "
      >
        COMEÇAR
      </button>

      <!-- LINK CADASTRO -->
      <p
        class="
          text-white mt-[20px] font-['Quicksand'] text-[1rem]
          max-[768px]:-translate-y-[0.9rem] max-[768px]:text-[0.9rem]
          top-[17px] relative

        "
      >
        Não tem conta?
        <span
          @click="router.push('/cadastro')"
          class="text-cyan-400 font-bold cursor-pointer"
        >
          Crie agora
        </span>
      </p>

      <!-- LINK ESQUECI SENHA -->
      <p
        class="
          text-white mt-[4px] font-['Quicksand'] text-[1rem]
          max-[768px]:text-[0.9rem]
          top-[15px] relative

        "
      >
        Esqueceu a senha?
        <span
          @click="router.push('/recuperar-senha')"
          class="text-cyan-400 font-bold cursor-pointer"
        >
          Clique aqui
        </span>
      </p>
    </form>

    <!-- ANJOS DIGITAIS -->
    <img
      src="/img/anjos.png"
      alt="anjosDigitais"
      class="
        h-auto mt-[12px] opacity-80
        w-[11%] -translate-y-[22.1rem]
        min-[1367px]:max-[1600px]:w-[10%] min-[1367px]:max-[1600px]:-translate-y-[25rem]
        min-[1025px]:max-[1366px]:w-[10%] min-[1025px]:max-[1366px]:-translate-y-[21rem]
        min-[769px]:max-[1024px]:w-[14%] min-[769px]:max-[1024px]:-translate-y-[23rem]
        max-[768px]:w-[45%] max-[768px]:-translate-y-[22rem] max-[768px]:opacity-70
      "
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()
const visivel = ref(false)
const email = ref('')
const senha = ref('')

onMounted(async () => {
  await nextTick()
  visivel.value = true
})

async function handleSubmit() {
  try {
    const response = await api.post('/iara/login', { email: email.value, senha: senha.value })
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('usuarioNome', response.data.usuario.nome)
    localStorage.setItem('usuarioId', response.data.usuario.id)
    toast.success(`Bem-vindo(a), ${response.data.usuario.nome}!`)
    router.push('/menu')
  } catch (error) {
    toast.error('Email ou senha incorretos.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

/* Autofill – não tem equivalente em Tailwind */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: black !important;
  transition: background-color 5000s ease-in-out 0s;
}

/*
 ============================================================
  NOTEBOOKS MENORES
  ============================================================ 
  */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) {
  /* Títulos */
  .text-center h1:nth-child(1) {
    font-size: 1.9rem !important;
    position: relative;
    top: 1px;

  }
  .text-center h1:nth-child(2),
  .text-center h1:nth-child(3) {
    position: relative;
    top: 1px;

  }

  /* Logo */
  img[alt="iara"] {
    width: 21% !important;
    position: relative ;
    top: 2.5rem !important; 
  }

  /* Formulário */
  form {
    position: relative;
    top: 80px;
    max-width: 320px !important;
  }

  /* Inputs */
  input {
    height: 45px !important;
    padding: 11px !important;
    font-size: 0.9rem !important;
    margin-bottom: -0px !important;
  }

  /* Botão */
  button[type="submit"] {
    height: 45px !important;
    font-size: 0.95rem !important;
    position: relative !important;
    top: 11px !important;
  }

  /* Link cadastro */
  form p:nth-child(4) {
    position: relative !important;
    top: 8% !important;
    font-size: 0.9rem !important;
  }

  /* Link esqueci senha - mais próximo */
  form p:nth-child(5) {
    position: relative !important;
    top: 8% !important;
    font-size: 0.9rem !important;
  }

   img[alt="anjosDigitais"] {
    width: 10% !important;
    height: auto !important;
    position: relative !important;
    top: 17.5% !important;
    opacity: 0.7 !important;
  }

}


/* ============================================================
   MOBILE — TODOS OS CELULARES (até 768px)
   ============================================================ */
@media (max-width: 768px) {
  /* Títulos */
  .text-center h1:nth-child(1) {
    font-size: 1.6rem !important;
    position: relative;
    top: 90%;
  }
  .text-center h1:nth-child(2),
  .text-center h1:nth-child(3) {
    position: relative;
    top: 90%;
  }

  /* Logo */
  img[alt="iara"] {
    width: 90% !important;
    height: auto !important;
    position: relative;
    top: 11% !important;
  }

  /* Formulário */
  form {
    position: relative;
    top: 12%;
    width: 70% !important;
    max-width: 320px !important;
  }

  /* Inputs */
  input {
    height: 45px !important;
    padding: 11px !important;
    font-size: 0.9rem !important;
    margin-bottom: 0.3px !important;
  }

  /* Botão */
  button[type="submit"] {
    height: 45px !important;
    font-size: 0.95rem !important;
    position: relative !important;
    top: 8.5% !important;
  }

  /* Link cadastro */
  form p:nth-child(4) {
    position: relative !important;
    top: 20% !important;
    font-size: 0.9rem !important;
  }

  /* Link esqueci senha - mais próximo */
  form p:nth-child(5) {
    position: relative !important;
    top: 10% !important;
    font-size: 0.9rem !important;
  }

  /* Anjos */
  img[alt="anjosDigitais"] {
    width: 40% !important;
    position: relative !important;
    top: 23% !important;
    opacity: 0.7 !important;
  }
}
</style>