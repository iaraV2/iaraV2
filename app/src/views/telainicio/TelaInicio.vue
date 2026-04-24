<template>
  <!-- ALTERAÇÃO: trocado 'flex items-center justify-center' puro
     por h-screen + overflow-hidden para garantir que nada ultrapasse a tela -->
<div
  :class="[
    'h-screen overflow-hidden flex items-center justify-center transition-opacity duration-[900ms] ease-in-out transition-transform duration-[2000ms]',
    saindo ? 'opacity-0 -translate-y-[10px]' : 'opacity-100 translate-y-0'
  ]"
>
    <div class="flex flex-col items-center justify-center w-full">

      <!-- ================================
           TÍTULO
           Desktop base (>1600px): font-size: 5.9em, top: -1rem
           Notebooks médios (1367–1600px): font-size: 5em, top: -0.8rem
           Notebooks pequenos (1025–1366px): font-size: 4.2em, top: -0.5rem
           Mobile (≤768px): font-size: 4.5em, top: 3.5rem, width: 100%, padding: 0 10px
           ================================ -->
      <h1 class="
        font-['Passion_One'] text-white text-center relative

        text-[5.9em] -top-[-6rem]

        min-[1367px]:max-[1600px]:text-[5em]
        min-[1367px]:max-[1600px]:-top-[0.8rem]

        min-[1025px]:max-[1366px]:text-[4.2em]
        min-[1025px]:max-[1366px]:-top-[0.5rem]

        max-[768px]:text-[4.5em]
        max-[768px]:top-[3.5rem]
        max-[768px]:left-0
        max-[768px]:w-full
        max-[768px]:px-[10px]
      ">
        IAra
      </h1>

      <!-- ================================
           LOGO
           Desktop base (>1600px): width: 30rem, top: -12rem
           Notebooks médios (1367–1600px): width: 26rem, top: -10.5rem
           Notebooks pequenos (1025–1366px): width: 22rem, top: -9rem
           Tablet (769–1024px): width: 25rem
           Mobile (≤768px): width: 19rem, top: -6rem, max-width: 95vw
           ================================ -->
      <img
        src="/img/iara.png"
        alt="logoiara"
        class="
          relative -top-[4rem] left-0 w-[30rem] h-auto

          min-[1367px]:max-[1600px]:w-[26rem]
          min-[1367px]:max-[1600px]:-top-[10.5rem]

          min-[1025px]:max-[1366px]:w-[22rem]
          min-[1025px]:max-[1366px]:-top-[9rem]

          min-[769px]:max-[1024px]:w-[25rem]

          max-[768px]:w-[19rem]
          max-[768px]:-top-[5rem]
          max-[768px]:left-0
          max-[768px]:max-w-[95vw]
        "
      />

      <!-- ================================
           BOTÃO
           Desktop base (>1600px): top: -25rem, width: 12rem, height: 3rem, font-size: 17px
           Notebooks médios (1367–1600px): top: -22rem, width: 12rem
           Notebooks pequenos (1025–1366px): top: -19rem, width: 12rem
           Tablet (769–1024px): left: 0
           Mobile (≤768px): top: -13.5rem, width: 50%, left: 0
           ================================ -->
      <button
        @click="irParaLogin"
        :disabled="comecando"
        class="
          bg-[#e25300] text-white font-['Quicksand']
          relative -top-[18rem] left-0
          rounded-[30px] w-[12rem] h-[3rem]
          text-[17px] border-none cursor-pointer

          min-[1367px]:max-[1600px]:-top-[20rem ]
          min-[1367px]:max-[1600px]:w-[12rem]

          min-[1025px]:max-[1366px]:-top-[19rem ]
          min-[1025px]:max-[1366px]:w-[12rem]

          min-[769px]:max-[1024px]:left-0

          max-[768px]:-top-[13.5rem]
          max-[768px]:w-[35%]
          max-[768px]:left-0

          disabled:opacity-60 hover:opacity-90 transition-opacity duration-300
        "
      >
        {{ comecando ? 'Começando...' : 'Entrar' }}
      </button>

      <!-- ================================
           ANJOS DIGITAIS
           Desktop base (>1600px): bottom: -13.9rem, width: 14%
           Notebooks médios (1367–1600px): width: 13%, bottom: -11rem
           Notebooks pequenos (1025–1366px): width: 15%, bottom: -9rem
           Mobile (≤768px): top: -12rem, width: 50%, margin: 0 auto, left: 0
           ================================ -->
      <img
        src="/img/anjos.png"
        alt="anjosdigitais"
        class="
          relative bottom-[7rem] left-0 w-[12%] h-auto

          min-[1367px]:max-[1600px]:w-[13%]
          min-[1367px]:max-[1600px]:bottom-[11rem]

          min-[1025px]:max-[1366px]:w-[15%]
          min-[1025px]:max-[1366px]:bottom-[9rem]

          max-[768px]:-top-[9rem] !important
          max-[768px]:bottom-auto
          max-[768px]:left-0
          max-[768px]:w-[39%]
          max-[768px]:mx-auto
        "
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
  }, 1000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700;900&family=Quicksand:wght@300..700&display=swap');

/* ============================================================
   Notebooks críticos com altura baixa (1025px–1366px + max-height: 720px)
   Tailwind não suporta combinação de max-width + max-height,
   por isso este breakpoint especial permanece em CSS puro
   ============================================================ */
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) {
  h1     { font-size: 3.8em !important; top: 4rem !important; }
  button { top: -11rem !important; width: 8rem !important; height: 2.7rem !important; font-size: 15px !important; }
  /* Anjos reduzido proporcionalmente junto com os demais breakpoints */
  img[alt="logoiara"]      { width: 20rem !important; top: -2rem !important; }
  img[alt="anjosdigitais"] { width: 9% !important; bottom: 4.9rem !important; }
  
}
</style>