<template>
  <div class="chat-page-container fixed top-0 left-0 w-screen h-screen bg-[#380075] z-[9999] flex items-center justify-center font-['Quicksand'] overflow-hidden">
    <div class="chat-window w-[95%] max-w-[1000px] h-[90vh] bg-[rgba(20,0,60,0.75)] backdrop-blur-[16px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[25px] flex flex-col relative overflow-hidden">

      <!-- Header -->
      <div class="chat-header bg-black/30 px-4 py-2 flex items-center justify-between border-b border-white/10 min-h-[60px] gap-2">
        <div class="header-info flex items-center gap-3 min-w-0">
          <img src="/img/iara.png" alt="Avatar IAra" class="w-[50px] h-[50px] relative right-[-10px] flex-shrink-0 rounded-full border-2 border-aqua object-cover bg-white p-[2px]" />
          <div class="chat-title min-w-0">
            <h2 class=" relative right-[-10px] top-[6px] text-white m-0 text-[1.1rem] font-bold leading-tight">IAra</h2>
            <span class="text-green-400 text-[0.65rem] font-normal whitespace-nowrap animate-pulse">
  ● Online e Aprendendo
</span>
          </div>
        </div>
        
        <!-- Botão com o novo ícone de Home (Casa) mais moderno -->
        <button
          type="button"
          @click="router.push('/menu')"
          class="w-8 h-8 relative right-[10px] flex-shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full cursor-pointer transition-all duration-300 hover:bg-cyan-400 hover:border-cyan-400 hover:text-[#420583] hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
            <path d="M19 21V9.753a1 1 0 0 0-.412-.813l-6-4.5a1 1 0 0 0-1.176 0l-6 4.5a1 1 0 0 0-.412.813V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z"/>
          </svg>
        </button>
      </div>

      <!-- Corpo do chat -->
      <div ref="chatBodyRef" class="chat-body flex-1 p-5 overflow-y-auto flex flex-col gap-5 scroll-smooth">
        <div v-if="!mensagens.length" class="text-center text-white/50 mt-[50px]">
          <p>Nenhuma mensagem ainda.<br/>Digite para falar com a IAra.</p>
        </div>
        <div
          v-for="(msg, index) in mensagens"
          :key="index"
          :class="[
            'mensagem max-w-[70%] flex items-center justify-center text-[0.90rem] leading-[1.5] shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-all',
            'py-4 px-6 text-center justify-items-center', 
            msg.tipo === 'recebida'
              ? 'recebida self-start bg-white/10 text-white rounded-[20px_20px_20px_4px] border border-white/5'
              : 'enviada self-end bg-gradient-to-br from-[#e25300] to-[#ff7b00] text-white rounded-[20px_20px_4px_20px]'
          ]"
        >
          <div class="mensagem-conteudo text-center w-auto max-w-full break-words whitespace-pre-wrap select-text">
            <vue-markdown :source="msg.texto" />
          </div>
        </div>

        <div v-if="carregando" class="italic text-white ml-5 text-[0.9rem] animate-pulse">
          IAra está digitando...
        </div>
        <div ref="fimDoChatRef"></div>
      </div>

      <!-- Footer / input -->
      <div class="chat-footer px-3 py-2 pb-safe bg-black/40 border-t border-white/10 w-[100%] h-[5.5rem] lg:h-[15%]">
        <div class="flex gap-3 items-center w-full">
          <input 
            class="relative left-[10px] top-[1.1rem] w-[80%] h-[48px] mx-auto bg-white/90 border-none text-[#380075] pr-4 py-[10px] rounded-[25px] text-[0.9rem] font-['Quicksand'] outline-none font-semibold placeholder:text-[#666] indent-5 lg:w-[92%]"
            type="text"
            :placeholder="carregando ? 'Aguarde...' : 'Digite para falar com a IAra...'"
            v-model="texto"
            @keydown.enter.prevent="enviarMensagem"
            :disabled="carregando"
          />

          <button
            class="relative top-[1.1rem] left-[9px] flex-shrink-0 w-[48px] h-[48px] rounded-full bg-white text-[#380075] flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 shadow-md"
            @click="enviarMensagem"
            :disabled="carregando"
          >
            <i class="ri-arrow-up-line text-[22px] font-light"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown-render'
import { api } from "../../services/api"

const router = useRouter(), mensagens = ref([]), texto = ref(""), carregando = ref(false), fimDoChatRef = ref(null)

const IconeEnviar = defineComponent({
  setup: () => () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', class: 'w-[28px] h-[24px] stroke-[2.5]' }, [
    h('path', { d: 'M22 2L11 13', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }),
    h('path', { d: 'M22 2L15 22L11 13L2 9L22 2Z', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
  ])
})

onMounted(async () => {
  try {
    const { data } = await api.get("/chat/historico")
    mensagens.value = data.map(m => ({ texto: m.texto, tipo: m.quemEnviou === "usuario" ? "enviada" : "recebida" }))
  } catch (e) { console.error(e) }
})

async function enviarMensagem() {
  if (!texto.value.trim() || carregando.value) return
  const msg = texto.value; texto.value = ""; carregando.value = true
  mensagens.value.push({ texto: msg, tipo: "enviada" })
  try {
    const { data } = await api.post("/chat/enviar", { mensagem: msg })
    mensagens.value.push({ texto: data.resposta, tipo: "recebida" })
  } catch (e) { mensagens.value.push({ texto: "Erro de conexão.", tipo: "recebida" }) }
  finally { carregando.value = false }
}

watch(mensagens, async () => { await nextTick(); fimDoChatRef.value?.scrollIntoView({ behavior: "smooth" }) }, { deep: true })

function formatarTexto(texto) {
  return texto.replace(/(.{25})/g, '$1\n')
}
</script>

<style scoped>
.chat-body::-webkit-scrollbar       { width: 6px; }
.chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

:deep(.mensagem p)          { margin: 0 0 10px 0; }
:deep(.mensagem p:last-child) { margin-bottom: 0; }
:deep(.mensagem strong)    { font-weight: 800; color: #fff; }
:deep(.mensagem ul),
:deep(.mensagem ol)        { margin: 5px 0 10px 20px; padding: 0; }
:deep(.mensagem li)        { margin-bottom: 5px; }

@media (max-width: 640px) {
  .chat-window {
    width: 100% !important;
    height: 100dvh !important; 
    border-radius: 0 !important;
  }
  .mensagem { max-width: 90% !important; }
}

.pb-safe { padding-bottom: max(8px, env(safe-area-inset-bottom)); }

:deep(.mensagem-conteudo p) {
  position: relative;
  padding: 0.5rem 0.5rem;
  top: 10px;
  margin: 0;
  text-align: center !important;
  min-width: 3rem; 
  max-width: 100%;
}
</style>