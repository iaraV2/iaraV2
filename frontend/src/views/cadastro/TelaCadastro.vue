<!-- frontend/src/views/TelaCadastro.vue -->
<template>
  <div class="min-h-screen bg-[#420583] flex flex-col items-center justify-between py-6 px-4 overflow-y-auto">

    <!-- Título -->
    <div class="text-center mt-2 w-full">
      <h1 class="font-['Quicksand'] text-cyan-400 font-light text-3xl md:text-4xl leading-tight">Junte-se</h1>
      <h1 class="font-['Quicksand'] text-cyan-400 font-bold text-4xl md:text-5xl leading-tight">à Comunidade</h1>
    </div>

    <!-- ── ESTADO: Cadastro enviado (professor pendente) ─────────────────── -->
    <div v-if="cadastroEnviado" class="flex flex-col items-center justify-center flex-grow w-full max-w-sm text-center gap-6">
      <div class="text-7xl animate-bounce">🌿</div>
      <div class="bg-white/10 border border-cyan-400/40 rounded-3xl p-8 w-full">
        <p class="font-['Quicksand'] text-cyan-400 font-bold text-2xl mb-3">
          Solicitação enviada!
        </p>
        <p class="font-['Quicksand'] text-white/80 text-base leading-relaxed">
          Seu cadastro como <strong class="text-white">Professor(a)</strong> foi recebido.<br/><br/>
          A equipe IAra vai revisar e você receberá um <strong class="text-cyan-400">e-mail de confirmação</strong> assim que for aprovado(a). 💜
        </p>
      </div>
      <button
        @click="router.push('/login')"
        class="w-full h-14 rounded-full bg-white/10 border border-cyan-400 text-cyan-400
               font-['Quicksand'] font-bold text-lg hover:bg-white/20 transition-all duration-200"
      >
        Voltar ao login
      </button>
    </div>

    <!-- ── ESTADO: Formulário de cadastro ────────────────────────────────── -->
    <div v-else class="flex flex-col items-center justify-center flex-grow w-full max-w-sm mt-4">

      <!-- Balão da IAra -->
      <div class="relative mb-2">
        <div class="bg-[#e25300] text-white font-['Quicksand'] font-bold px-5 py-2 rounded-2xl shadow-lg relative z-10 animate-bounce">
          Vamos criar seu perfil!
        </div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e25300] rotate-45 z-0"></div>
      </div>

      <img src="/img/iara.png" alt="iara" class="w-48 md:w-56 mb-6 drop-shadow-2xl" />

      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-4" novalidate>

        <!-- Nome -->
        <input
          v-model="nome"
          type="text"
          placeholder="Nome Completo"
          required
          class="w-full h-14 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white
                 shadow-md outline-none focus:ring-2 focus:ring-cyan-400
                 placeholder:font-medium placeholder:text-gray-400"
        />

        <!-- E-mail -->
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full h-14 rounded-full pl-6 pr-4 font-['Quicksand'] text-lg text-black bg-white
                 shadow-md outline-none focus:ring-2 focus:ring-cyan-400
                 placeholder:font-medium placeholder:text-gray-400"
        />

        <!-- Senha -->
        <div class="relative w-full">
          <input
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            placeholder="Senha"
            required
            class="w-full h-14 rounded-full pl-6 pr-12 font-['Quicksand'] text-lg text-black bg-white
                   shadow-md outline-none focus:ring-2 focus:ring-cyan-400
                   placeholder:font-medium placeholder:text-gray-400"
          />
          <button
            type="button"
            @click="mostrarSenha = !mostrarSenha"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e25300] transition-colors"
          >
            <!-- Ícone olho aberto -->
            <svg v-if="mostrarSenha" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                       c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                       C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- Ícone olho fechado -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5
                       c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5
                       c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774
                       M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21
                       m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>

        <!-- ── Seletor de Role ─────────────────────────────────────────── -->
        <div class="w-full">
          <p class="font-['Quicksand'] text-white/70 text-sm text-center mb-3">
            Como você vai usar a IAra?
          </p>

          <div class="grid grid-cols-2 gap-3">

            <!-- Opção: Aluno -->
            <button
              type="button"
              @click="roleSelecionada = 'aluno'"
              :class="[
                'h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer',
                roleSelecionada === 'aluno'
                  ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'bg-white/5 border-white/20 hover:border-white/50'
              ]"
            >
              <span class="text-2xl">🎒</span>
              <span class="font-['Quicksand'] font-bold text-white text-sm">Aluno(a)</span>
              <span class="font-['Quicksand'] text-white/50 text-xs">Aprender com a IAra</span>
            </button>

            <!-- Opção: Professor -->
            <button
              type="button"
              @click="roleSelecionada = 'professor'"
              :class="[
                'h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer',
                roleSelecionada === 'professor'
                  ? 'bg-[#e25300]/20 border-[#e25300] shadow-lg shadow-[#e25300]/20'
                  : 'bg-white/5 border-white/20 hover:border-white/50'
              ]"
            >
              <span class="text-2xl">📚</span>
              <span class="font-['Quicksand'] font-bold text-white text-sm">Professor(a)</span>
              <span class="font-['Quicksand'] text-white/50 text-xs">Publicar conteúdos</span>
            </button>
          </div>

          <!-- Aviso contextual para professor -->
          <div
            v-if="roleSelecionada === 'professor'"
            class="mt-3 bg-[#e25300]/10 border border-[#e25300]/40 rounded-2xl px-4 py-3
                   flex items-start gap-2"
          >
            <span class="text-lg mt-0.5">⏳</span>
            <p class="font-['Quicksand'] text-white/80 text-xs leading-relaxed">
              Cadastros de <strong class="text-white">Professor(a)</strong> passam por aprovação da equipe IAra.
              Você receberá um <strong class="text-[#e25300]">e-mail</strong> quando for aprovado(a).
            </p>
          </div>
        </div>

        <!-- Botão submit -->
        <button
          type="submit"
          :disabled="carregando"
          class="w-full h-14 mt-2 rounded-full bg-[#e25300] hover:bg-[#ff7b00] text-white
                 font-['Quicksand'] font-bold text-lg transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="carregando">Cadastrando...</span>
          <span v-else-if="roleSelecionada === 'professor'">ENVIAR SOLICITAÇÃO</span>
          <span v-else>CRIAR CONTA</span>
        </button>

        <!-- Link login -->
        <div class="text-center text-white font-['Quicksand'] mt-2">
          <p>
            Já tem uma conta?
            <span
              @click="router.push('/login')"
              class="text-cyan-400 font-bold cursor-pointer hover:underline"
            >
              Faça login
            </span>
          </p>
        </div>

      </form>
    </div>

    <img src="/img/anjos.png" alt="anjosDigitais" class="w-32 md:w-36 mt-8 opacity-80" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useToast } from 'vue-toastification'

const router    = useRouter()
const authStore = useAuthStore()
const toast     = useToast()

const nome           = ref('')
const email          = ref('')
const senha          = ref('')
const roleSelecionada = ref('aluno')   // padrão: aluno
const carregando     = ref(false)
const mostrarSenha   = ref(false)
const cadastroEnviado = ref(false)     // controla a tela de confirmação para professor

async function handleSubmit() {
  carregando.value = true
  try {
    // Passa a role escolhida para o authStore.cadastrar
    // O backend decide se cria 'aluno' ou 'professor_pendente'
    const resultado = await authStore.cadastrar(
      nome.value,
      email.value,
      senha.value,
      'Padrão',
      roleSelecionada.value   // novo parâmetro
    )

    if (roleSelecionada.value === 'professor') {
      // Exibe tela de confirmação — professor não entra direto
      cadastroEnviado.value = true
    } else {
      // Aluno criado → vai direto pro login
      toast.success('Conta criada com sucesso! Faça seu login.')
      router.push('/login')
    }

  } catch (error) {
    toast.error(error.response?.data?.erro || 'Erro ao criar conta. Tente novamente.')
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: black !important;
}
</style>