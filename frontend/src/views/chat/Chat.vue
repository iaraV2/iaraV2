<template>
  <div class="chat-page-container fixed top-0 left-0 w-screen h-screen bg-[#380075] z-[9999] flex items-center justify-center font-['Quicksand'] overflow-hidden">
    <div class="chat-window w-[95%] max-w-[1000px] h-[90vh] bg-[rgba(20,0,60,0.75)] backdrop-blur-[16px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[25px] flex flex-col relative overflow-hidden">

      <!-- Header -->
      <div class="chat-header bg-black/30 px-4 py-2 flex items-center justify-between border-b border-white/10 min-h-[60px] gap-2">
        <div class="header-info flex items-center gap-3 min-w-0">
          <img src="/img/iara.png" alt="Avatar IAra" class="w-[46px] h-[46px] flex-shrink-0 rounded-full border-2 border-aqua object-cover bg-white p-[2px]" />
          <div class="chat-title min-w-0">
            <h2 class="text-white m-0 text-[1.1rem] font-bold leading-tight">IAra</h2>
            <span class="text-white text-[0.65rem] font-normal opacity-90 whitespace-nowrap">● Online e Aprendendo</span>
          </div>
        </div>
        <!-- flex-shrink-0: botão nunca encolhe, não vai para a próxima linha -->
        <button
          class="flex-shrink-0 bg-transparent border border-white/40 text-white px-4 py-1.5 rounded-[20px] cursor-pointer font-bold text-sm transition-all duration-300 hover:bg-white/10 hover:border-aqua hover:text-aqua"
          @click="router.push('/menu')"
        >
          Voltar
        </button>
      </div>

      <!-- Corpo do chat -->
      <div ref="chatBodyRef" class="chat-body flex-1 p-5 overflow-y-auto flex flex-col gap-5 scroll-smooth">
        <div v-if="!mensagens.length" class="text-center text-white/50 mt-[50px]">
          <p>Nenhuma mensagem ainda.<br/>Comece dando um "Oi"!</p>
        </div>

        <div
          v-for="(msg, index) in mensagens"
          :key="index"
          :class="[
            'mensagem max-w-[80%] p-[12px_15px] text-[0.95rem] leading-[1.5] break-words shadow-[0_2px_5px_rgba(0,0,0,0.2)]',
            msg.tipo === 'recebida'
              ? 'recebida self-start bg-white/10 text-white rounded-[20px_20px_20px_4px] border border-white/5'
              : 'enviada self-end bg-gradient-to-br from-[#e25300] to-[#ff7b00] text-white rounded-[20px_20px_4px_20px]'
          ]"
        >
          <div class="mensagem-conteudo px-1"><vue-markdown :source="msg.texto" /></div>
        </div>

        <div v-if="carregando" class="italic text-white ml-5 text-[0.9rem] animate-pulse">
          IAra está digitando...
        </div>
        <div ref="fimDoChatRef"></div>
      </div>

      <!-- Footer / input -->
      <!-- pb-safe: respeita safe-area do iOS para o input não ficar atrás da barra home -->
      <div class="chat-footer px-3 py-2 pb-safe bg-black/40 border-t border-white/10">
        <div class="flex gap-3 items-center w-full">
          <input
            class="flex-1 min-w-0 bg-white/90 border-none text-[#380075] p-[10px_14px] rounded-[25px] text-[0.9rem] font-['Quicksand'] outline-none font-semibold placeholder:text-[#666]"
            type="text"
            :placeholder="carregando ? 'Aguarde...' : 'Digite sua dúvida...'"
            v-model="texto"
            @keydown.enter.prevent="enviarMensagem"
            :disabled="carregando"
          />
          <button
            class="flex-shrink-0 w-[48px] h-[48px] rounded-full border-none bg-aqua text-[#380075] flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_0_10px_rgba(0,255,255,0.4)] hover:scale-110 hover:bg-white"
            @click="enviarMensagem"
            :disabled="carregando"
          >
            <IconeEnviar />
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
    const { data } = await api.get("/iara/chat/historico")
    mensagens.value = data.map(m => ({ texto: m.texto, tipo: m.quemEnviou === "usuario" ? "enviada" : "recebida" }))
  } catch (e) { console.error(e) }
})

async function enviarMensagem() {
  if (!texto.value.trim() || carregando.value) return
  const msg = texto.value; texto.value = ""; carregando.value = true
  mensagens.value.push({ texto: msg, tipo: "enviada" })
  try {
    const { data } = await api.post("/iara/chat/enviar", { mensagem: msg })
    mensagens.value.push({ texto: data.resposta, tipo: "recebida" })
  } catch (e) { mensagens.value.push({ texto: "Erro de conexão. 😴", tipo: "recebida" }) }
  finally { carregando.value = false }
}

watch(mensagens, async () => { await nextTick(); fimDoChatRef.value?.scrollIntoView({ behavior: "smooth" }) }, { deep: true })
</script>

<style scoped>
.chat-body::-webkit-scrollbar       { width: 6px; }
.chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

:deep(.mensagem p)         { margin: 0 0 10px 0; }
:deep(.mensagem p:last-child) { margin-bottom: 0; }
:deep(.mensagem strong)    { font-weight: 800; color: #fff; }
:deep(.mensagem ul),
:deep(.mensagem ol)        { margin: 5px 0 10px 20px; padding: 0; }
:deep(.mensagem li)        { margin-bottom: 5px; }

/* Mobile: ocupa tela inteira sem bordas arredondadas */
@media (max-width: 640px) {
  .chat-window {
    width: 100% !important;
    height: 100dvh !important; /* dvh = dynamic viewport height: desconta barra do iOS */
    border-radius: 0 !important;
  }
  .mensagem { max-width: 90% !important; }
}

/* Safe area iOS: evita que o input fique atrás da barra home */
.pb-safe { padding-bottom: max(8px, env(safe-area-inset-bottom)); }
</style>