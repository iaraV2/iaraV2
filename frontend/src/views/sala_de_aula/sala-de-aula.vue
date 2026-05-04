<template>
  <div class="sala-container min-h-screen bg-[#420583] flex flex-col items-center py-6 px-4 overflow-y-auto font-['Quicksand']">
    <button @click="router.push('/menu')" class="absolute top-5 left-5 z-[1000] bg-black/20 border border-cyan-400 text-white py-2 px-4 rounded-[20px] cursor-pointer font-bold hover:bg-cyan-400 hover:text-[#420583] transition-colors">⬅ Voltar</button>

    <div class="text-center w-full mt-10 mb-8">
      <h1 class="text-cyan-400 font-light text-3xl md:text-5xl leading-tight">Sala de</h1>
      <h1 class="text-cyan-400 font-bold text-4xl md:text-6xl leading-tight">Aula</h1>
    </div>

    <div class="grid-aulas grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
      <div v-for="c in cursos" :key="c.id" class="card-aula bg-white rounded-[30px] p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-transform cursor-pointer group relative overflow-hidden">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:opacity-80 transition-colors" :style="{ backgroundColor: c.cor }"><span class="text-3xl">{{ c.icone }}</span></div>
        <h3 class="text-[#420583] font-bold text-xl mb-2">{{ c.titulo }}</h3>
        <p class="text-gray-600 text-sm mb-3">Nível: {{ c.nivel }}</p>
        <div class="text-2xl font-bold text-[#420583] mb-4">{{ c.progresso }}%</div>
        <button class="mt-auto bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors w-full max-w-[200px]">{{ c.progresso === 100 ? 'Rever' : c.progresso === 0 ? 'Acessar' : 'Continuar' }}</button>
        <div class="absolute bottom-0 left-0 h-2 bg-green-500 transition-all duration-500" :style="{ width: c.progresso + '%' }"></div>
      </div>
    </div>

    <div class="mt-12 mb-6"><img src="/img/anjos.png" alt="Anjos Digitais" class="w-32 opacity-70"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cursos = ref([
  { id: 1, titulo: "Primeiros Passos no Digital", nivel: "Iniciante", progresso: 100, cor: "#FFD700", icone: "🌻" },
  { id: 2, titulo: "Vendendo no WhatsApp", nivel: "Intermediário", progresso: 45, cor: "#25D366", icone: "📱" },
  { id: 3, titulo: "Instagram para Negócios", nivel: "Avançado", progresso: 10, cor: "#C13584", icone: "📸" },
  { id: 4, titulo: "Segurança na Internet", nivel: "Essencial", progresso: 0, cor: "#2A52BE", icone: "🛡️" },
  { id: 5, titulo: "Criando Artes no Canva", nivel: "Criativo", progresso: 0, cor: "#00C4CC", icone: "🎨" },
  { id: 6, titulo: "Controle Financeiro Simples", nivel: "Básico", progresso: 0, cor: "#85bb65", icone: "💰" }
])
</script>

<style scoped>
@media (min-width: 768px) { .grid-aulas { max-width: 100% !important; padding: 0 2rem !important; } .card-aula { min-height: 300px !important; } }
@media (min-width: 1025px) and (max-width: 1366px) and (max-height: 720px) {
  .grid-aulas { grid-template-columns: repeat(3, 1fr) !important; gap: 20px !important; padding: 0 1.5rem !important; }
  .card-aula { padding: 20px !important; min-height: 280px !important; }
  h1 { font-size: 2.5rem !important; }
}
@media (max-width: 767px) { .grid-aulas { grid-template-columns: 1fr !important; padding: 0 1rem !important; gap: 16px !important; } .card-aula { padding: 16px !important; min-height: 250px !important; } h1 { font-size: 2rem !important; } }
@media (max-width: 480px) { .grid-aulas { padding: 0 0.5rem !important; } .card-aula { padding: 12px !important; min-height: 220px !important; } }
</style>
