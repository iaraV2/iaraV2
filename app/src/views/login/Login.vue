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
    <div class="text-center mt-[20px] z-[100]">
      <h1
        class="
          font-['Quicksand'] text-cyan-400 m-0 leading-[1.1] font-light
          text-[2.5rem]
          min-[1367px]:max-[1600px]:text-[2.2rem]
          min-[1025px]:max-[1366px]:text-[2rem]
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[1.9rem]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:top-[1px]
          /* Mobile */
          max-[768px]:!text-[1.3rem] max-[768px]:relative max-[768px]:!top-[1%] max-[768px]:translate-y-0
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
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:top-[1px]
          /* Mobile */
          max-[768px]:relative max-[768px]:!top-[1%] max-[768px]:translate-y-0 max-[768px]:!text-[1.3rem]
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
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:top-[1px]
          /* Mobile */
          max-[768px]:relative max-[768px]:!top-[1%] max-[768px]:translate-y-0 max-[768px]:!text-[1.3rem]
        "
      >
        à IAra
      </h1>
    </div>

    <img
      src="/img/iara.png"
      alt="iara"
      class="
        h-auto object-contain z-[5] my-[10px]
        [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.3))]
        w-[25%] -translate-y-[14.8em]
        min-[1367px]:max-[1600px]:w-[22%] min-[1367px]:max-[1600px]:-translate-y-[13em]
        min-[1025px]:max-[1366px]:w-[20%] min-[1025px]:max-[1366px]:-translate-y-[11em]
        /* Notebooks */
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!w-[21%]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!top-[-8.5rem]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:translate-y-0
        /* Mobile */
        max-[768px]:!w-[90%] max-[768px]:relative max-[768px]:!bottom-[11rem] max-[768px]:translate-y-0
      "
    />

    <form
      @submit.prevent="handleSubmit"
      class="
        flex flex-col items-center w-full z-[10] px-[20px]
        max-w-[380px] -translate-y-[28.5rem]
        min-[1367px]:max-[1600px]:-translate-y-[26rem]
        min-[1025px]:max-[1366px]:-translate-y-[22rem] min-[1025px]:max-[1366px]:max-w-[340px]
        /* Notebooks */
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:bottom-[45%]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!max-w-[320px]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:translate-y-0
        /* Mobile */
        max-[768px]:relative max-[768px]:!bottom-[21rem] max-[768px]:!w-[70%] max-[768px]:!max-w-[320px] max-[768px]:translate-y-0
      "
    >
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="
          w-full h-[55px] rounded-[30px] border-none outline-none
          font-['Quicksand'] text-[1rem] placeholder:pl-[15px]
          bg-[rgb(253,251,251)] text-black shadow-[2px_2px_5px_rgba(0,0,0,0.2)]
          p-[15px] mb-[12px] focus:bg-white
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!h-[45px]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!p-[11px]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[0.9rem]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!mb-0
          /* Mobile */
          max-[768px]:!h-[45px] max-[768px]:!p-[11px] max-[768px]:!text-[0.9rem] max-[768px]:!mb-[0.3px]
        "
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        required
        class="
          w-full h-[55px] rounded-[30px] border-none outline-none
          font-['Quicksand'] text-[1rem] placeholder:pl-[15px] 
          bg-[rgb(253,251,251)] text-black shadow-[2px_2px_5px_rgba(0,0,0,0.2)]
          top-[5.5px] relative p-[15px] mb-[12px] focus:bg-white
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!h-[45px]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!p-[11px]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[0.9rem]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!mb-0
          /* Mobile */
          max-[768px]:!h-[45px] max-[768px]:!p-[11px] max-[768px]:!text-[0.9rem] max-[768px]:!mb-[0.3px]
        "
      />

      <button
        type="submit"
        class="
          w-full h-[55px] p-[15px] rounded-[30px] border-none cursor-pointer
          bg-[#e25300] text-[#f4f4f5] font-['Quicksand']
          top-[17px] relative font-medium text-[1.1rem] leading-[1]
          transition-[transform,background-color] duration-200
          hover:bg-[#ff7b00] hover:scale-[1.02]
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!h-[45px]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[0.95rem]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!top-[11px]
          /* Mobile */
          max-[768px]:!h-[45px] max-[768px]:!text-[0.95rem] max-[768px]:relative max-[768px]:!top-[8.5%]
        "
      >
        COMEÇAR
      </button>

      <p
        class="
          text-white mt-[20px] font-['Quicksand'] text-[1rem]
          top-[17px] relative
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!top-[8%]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[0.9rem]
          /* Mobile */
          max-[768px]:relative max-[768px]:!top-[10%] max-[768px]:!text-[0.9rem] max-[768px]:translate-y-0
        "
      >
        Não tem conta?
        <span @click="router.push('/cadastro')" class="text-cyan-400 font-bold cursor-pointer"> Crie agora </span>
      </p>

      <p
        class="
          text-white mt-[4px] font-['Quicksand'] text-[1rem]
          top-[15px] relative
          /* Notebooks */
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!top-[8%]
          [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!text-[0.9rem]
          /* Mobile */
          max-[768px]:relative max-[768px]:!top-[10%] max-[768px]:!text-[0.9rem]
        "
      >
        Esqueceu a senha?
        <span @click="router.push('/recuperar-senha')" class="text-cyan-400 font-bold cursor-pointer"> Clique aqui </span>
      </p>
    </form>

    <img
      src="/img/anjos.png"
      alt="anjosDigitais"
      class="
        h-auto mt-[12px] opacity-80
        w-[11%] -translate-y-[22.1rem]
        min-[1367px]:max-[1600px]:w-[10%] min-[1367px]:max-[1600px]:-translate-y-[25rem]
        min-[1025px]:max-[1366px]:w-[10%] min-[1025px]:max-[1366px]:-translate-y-[21rem]
        /* Notebooks */
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!w-[10%]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:relative
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:!top-[-14.5rem]
        [@media(min-width:1025px)_and_(max-width:1366px)_and_(max-height:720px)]:translate-y-0
        /* Mobile */
        max-[768px]:!w-[40%] max-[768px]:relative max-[768px]:!bottom-[19rem] max-[768px]:!opacity-70 max-[768px]:translate-y-0
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
</style>