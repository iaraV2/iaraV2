<template>
  <div 
    class="min-h-screen bg-[#310A7C] flex flex-col items-center justify-between py-10 transition-all duration-1000 ease-in-out overflow-hidden"
    :class="{ 'opacity-0 -translate-y-5': saindo }"
  >
    
    <div class="flex flex-col items-center gap-8 mt-10">
      
      <h1 class="text-white text-[5.9rem] font-['Passion_One'] tracking-wide">
        IAra
      </h1>

      <img 
        src="/img/iara.png" 
        alt="Logo IAra" 
        class="w-64 h-auto object-contain z-10" 
      />

      <button
        @click="irParaLogin"
        :disabled="comecando"
        class="bg-[#e25300] hover:bg-[#c74d07] text-white font-['Quicksand'] text-[17px] font-bold py-3 px-16 rounded-full w-[225px] h-[47px] flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed z-20 shadow-lg"
      >
        {{ comecando ? 'Começando...' : 'Entrar' }}
      </button>

    </div>

    <div>
      <img 
        src="/img/anjos.png" 
        alt="Anjos Digitais" 
        class="w-[200px] h-[80px] object-contain" 
      />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const comecando = ref(false);
const saindo = ref(false);

function irParaLogin() {
  comecando.value = true;
  saindo.value = true; 

  setTimeout(() => {
    router.push('/login'); 
  }, 1000);
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700;900&family=Quicksand:wght@300..700&display=swap');
</style>