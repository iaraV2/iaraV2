<template>
  <!-- Adicionada a classe global 'bg-fundo-default' para segurar o fundo antes do Vue processar o JS -->
  <div class="menu-container w-full h-full flex flex-col bg-[#380075] bg-fundo-default overflow-y-auto" :style="backgroundStyle">
    <div v-if="carregando" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white/60 text-sm">Carregando chat...</p>
      </div>
    </div>
    <BackButton
      button-class="fixed top-12 left-5 z-[1000] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95 btn-voltar-hover"
      @click="modal.visible = true"
    />
    <div v-if="modal.visible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] backdrop-blur-sm animate-fadeIn">
      <div class="bg-white rounded-3xl p-8 w-85 h-22 shadow-2xl text-center">
        <h3 class="font-['Quicksand'] font-bold text-[#420583] text-2xl mb-2">Sair da conta?</h3>
        <p class="font-['Quicksand'] text-gray-500 text-sm mb-6">Tem certeza que deseja se desconectar da IAra?</p>
        <div class="flex justify-center gap-3">
          <button @click="modal.visible = false" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">Não</button>
          <button @click="efetuarLogout" class="w-28 py-3 rounded-full font-['Quicksand'] font-bold text-white bg-[#e25300] hover:bg-[#ff7b00] transition-colors">Sim, Sair</button>
        </div>
      </div>
    </div>
    <div class="metadeSuperior flex-shrink-0 min-h-[45%] w-full flex flex-col items-center justify-center relative overflow-visible lg:top-[2%]">
      <div class="saudacaoContainer text-center z-10 animate-fadeIn">
        <h1 class="textoSaudacao font-['Quicksand'] text-white font-light text-[2rem] m-0">
          Olá, <span class="nomeDestaque text-aqua font-bold capitalize">{{ nomeUsuario }}</span>!👋
        </h1>
        <p class="subtextoSaudacao font-['Quicksand'] text-[#e0e0e0] text-base mt-[5px]">
          Como posso te ajudar hoje?
        </p>
      </div>
      <div class="flex items-center justify-center gap-4 relative z-[5]">
        <img src="/img/foguete2.png" alt="Foguete" class="extra-menu-img w-[50%] relative bottom-[4rem] left-[5.7rem] transform rotate-22 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
        <img src="/img/lampada.png" alt="lampada" class="extra-menu-img w-[18%] relative top-[2rem] left-[0.5rem] transform -rotate-12 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
        <img src="/img/iara.png" alt="Logo IAra" class="logoIaraMenu w-56 md:w-[24rem] lg:w-[28rem] -left-[1.9rem] h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)] relative z-[100]" />
        <img src="/img/beca.png" alt="beca" class="extra-menu-img w-[26%] relative bottom-[4.3rem] right-[4rem] transform rotate-22 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
        <img src="/img/livro.png" alt="livro" class="extra-menu-img w-[26%] relative top-[2.5rem] right-[11.5rem] transform rotate-22 h-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
      </div>      
      <div class="absolute bottom-[-10px] left-0 w-full overflow-hidden leading-[0] z-0 wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="relative block w-full h-[70px] sm:h-[90px] md:h-[120px]" fill="#f0f4f8">
          <path d="M0,60C100,10,200,110,300,60C400,10,500,110,600,60C700,10,800,110,900,60C1000,10,1100,110,1200,60V120H0V60Z"></path>
        </svg>
      </div>
    </div>

    <div class="estruturaInferior flex-grow w-full bg-[#f0f4f8] flex flex-col items-center justify-start p-5 pt-2 sm:pt-5 pb-20 box-border relative z-10">
      
      <div class="grid-cards grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[24px] w-full max-w-5xl mt-2">
        
        <div 
          v-for="card in cards" 
          :key="card.titulo" 
          @click="irPara(card.rota)" 
          class="card-item bg-gradient-to-br from-white to-gray-50 rounded-[16px] md:rounded-[24px] shadow-[0_8px_16px_rgba(0,0,0,0.1)] md:shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-row items-center cursor-pointer transition-all duration-300 hover:translate-y-[-4px] md:hover:translate-y-[-6px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] text-left p-4 relative overflow-hidden md:flex-col md:items-center md:text-center md:p-6 lg:p-8 md:justify-between md:h-[280px] lg:h-[280px]"
        >  
          <div class="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-[16px] md:hidden" :style="{ backgroundColor: card.borderColor }"></div>
          
          <div class="hidden md:block absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-5" :style="{ backgroundColor: card.borderColor }"></div>
          <div class="hidden md:block absolute bottom-[-15px] left-[-15px] w-24 h-24 rounded-full opacity-5" :style="{ backgroundColor: card.borderColor }"></div>
          
          <div class="flex-shrink-0 w-20 h-20 md:w-20 md:h-20 rounded-[18px] md:rounded-full flex items-center justify-center ml-1 mr-4 md:mx-auto md:mb-2 shadow-md md:shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] z-10 lg:relative lg:top-[10%]" :class="card.bgColor">
            <component :is="card.iconIsSvg ? 'svg' : 'i'" v-bind="card.iconProps" :class="[card.iconClass, 'md:!text-[32px]']" :style="{ color: card.borderColor }" />
          </div>
          
          <div class="flex-1 min-w-0 z-10 relative left-[2%] md:left-0 md:w-full md:flex md:flex-col md:items-center">
            <h6 class="card-titulo text-[#1E1B4B] font-['Quicksand'] font-bold !text-[15px] md:!text-[22px] leading-snug mb-1 relative left-[5px] md:left-0 md:mb-2 lg:relative lg:top-[22%]">
              {{ card.titulo }}
            </h6>
            <p class="text-gray-600 font-['Quicksand'] !text-[14px] md:!text-[14px] md:text-slate-500 md:font-medium leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none relative left-[5px] md:left-0 md:max-w-[250px] lg:relative lg:top-[23%]">
              {{ card.descricao }}
            </p>
          </div>
          
          <div 
            class="flex-shrink-0 w-10 h-10 md:w-28 md:h-10 rounded-full md:rounded-2xl flex items-center justify-center ml-3 md:ml-0 md:mx-auto md:mt-1 md:-translate-y-8 shadow-md transition-transform duration-300 hover:scale-110 hover:md:scale-110 hover:md:translate-y-1 z-10" 
            :style="{ backgroundColor: card.borderColor }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="md:w-5 md:h-5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 border border-gray-200/60 rounded-2xl p-4 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.03)] text-center mt-8 mb-8 w-full max-w-[92%] md:max-w-2xl lg:h-[3rem] relative z-20">
        <i class="fa-solid fa-star text-amber-400 text-sm md:text-base animate-pulse flex-shrink-0"></i>
        <p class="font-['Quicksand'] font-medium text-gray-600 text-xs md:text-sm tracking-wide m-0">
          "O conhecimento transforma o mundo. Continue evoluindo com a IAra! ✨"
        </p>
      </div>

    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  </div>
</template>

<script setup>
import { computed, reactive, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/ui/BackButton.vue'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter(), authStore = useAuthStore()
const nomeUsuario = computed(() => authStore.usuario?.nome || 'Visitante')
const modal = reactive({ visible: false })

// Inicializa com o tamanho atual se já estiver no ambiente do navegador (previne bug de refresh)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => windowWidth.value < 640)
const isTablet = computed(() => windowWidth.value >= 640 && windowWidth.value < 1024)

const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

const desktopBackgroundStyle = {
  backgroundImage: "url('/img/fundo.png')",
  backgroundSize: 'contain',
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll'
}

const tabletBackgroundStyle = {
  backgroundImage: "url('/img/fundo.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll'
}

const mobileBackgroundStyle = {
  backgroundImage: "url('/img/fundo2.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll'
}

const backgroundStyle = computed(() => {
  if (isMobile.value) return mobileBackgroundStyle
  if (isTablet.value) return tabletBackgroundStyle
  return desktopBackgroundStyle
})

const efetuarLogout = () => {
  modal.visible = false
  authStore.logout()
}

const cards = [
  { 
    titulo: 'Empreender', 
    descricao: 'Descubra ideias, ferramentas e conteúdos para seus projetos.', 
    rota: '/empreender', 
    iconIsSvg: false, 
    iconClass: 'fa-solid fa-rocket text-4xl md:text-5xl', 
    borderColor: '#2563EB', 
    bgColor: 'bg-blue-50' 
  },
  { 
    titulo: 'Dicas de Inclusão Digital', 
    descricao: 'Acesse dicas e tutoriais para se conectar com o mundo digital.', 
    rota: '/dicas', 
    iconIsSvg: false, 
    iconClass: 'fa-regular fa-lightbulb text-4xl md:text-5xl', 
    borderColor: '#F97316', 
    bgColor: 'bg-orange-50' 
  },
  { 
    titulo: 'Sala de Aula', 
    descricao: 'Acesse seus cursos, matériais e atividades em um só lugar.', 
    rota: '/sala-de-aula', 
    iconIsSvg: false, 
    iconClass: 'fa-solid fa-chalkboard-user text-4xl md:text-5xl', 
    borderColor: '#7C3AED', 
    bgColor: 'bg-purple-50' 
  },
  { 
    titulo: 'Iniciar uma Conversa', 
    descricao: 'Converse com a IAra e descubra possibilidades.', 
    rota: '/chat', 
    iconIsSvg: false, 
    iconClass: 'fa-regular fa-comments text-4xl md:text-5xl', 
    borderColor: '#22C55E', 
    bgColor: 'bg-green-50' 
  }
]

const carregando = ref(false)

const irPara = async (rota) => {
  if (rota === '/empreender' || rota === '/dicas') return
  
  if (rota === '/chat') {
    carregando.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    carregando.value = false
  }
  
  router.push(rota)
}
</script>

<style scoped>
/* CSS NATIVO ANTI-BUG DE REFRESH: Aplica a imagem imediatamente via Media Queries do navegador */
.bg-fundo-default {
  background-color: #380075;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

@media (max-width: 639px) {
  .bg-fundo-default {
    background-image: url('/img/fundo2.jpg');
    background-size: cover;
    background-position: center;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .bg-fundo-default {
    background-image: url('/img/fundo.png');
    background-size: cover;
    background-position: center;
  }
}

@media (min-width: 1024px) {
  .bg-fundo-default {
    background-image: url('/img/fundo.png');
    background-size: contain;
    background-position: center top;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
.border-aqua { border-color: aqua; }
.text-aqua   { color: aqua; }

.wave-divider {
  display: block;
}
@media (min-width: 640px) {
  .wave-divider {
    display: none;
  }
}

/* ── Mobile pequeno (< 640px) ─────────────────────────────────── */
@media (max-width: 639px) {
  .textoSaudacao    { font-size: 1.5rem; position:relative; top:10%; }
  .subtextoSaudacao { font-size: 0.9rem; position:relative; top:10%;}
  .logoIaraMenu {
    height: 38vh;
    position: relative;
    top: -50px;
    margin-bottom: -60px;
  }
  .card-item  {
    padding: 14px;
    min-height: auto;
    width: 92%; 
    position: relative;
    left: 4%; 
  }
  .card-item .w-\[72px\] {
    width: auto;
    height: auto;
  }
  .card-item .rounded-\[18px\] {
    border-radius: 16px;
  }
  
  .card-titulo { font-size: inherit; }
  
  .card-item .w-10 {
    width: 32px;
    height: 32px;
  }
  .card-item .w-10 svg {
    width: 16px;
    height: 16px;
  }
}

/* ── Notebooks Menores / Tablets (640px – 1023px) ────────────────── */
@media (min-width: 640px) and (max-width: 1023px) {
  .textoSaudacao { font-size: 1.8rem; }
  .logoIaraMenu  {
    height: 58vh;
    margin-bottom: -130px;
  }
  .grid-cards { 
    max-width: 680px; 
  }
}

/* ── Telas Grandes / Desktop (≥ 1024px) ───────────────────────────────────────── */
@media (min-width: 1024px) {
  .saudacaoContainer { position: relative; bottom: 0%; }
  .logoIaraMenu {
    height: 68vh;
    position: relative;
    bottom: 5%;
    left: 0 !important;
  }

  .extra-menu-img {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
  .grid-cards {
    padding: 20px;
    gap: 25px; 
  }
}
</style>