<template>
  <!-- ALTERAÇÃO: h-screen overflow-hidden no root para nenhum filho vazar -->
  <div>
    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName" mode="default">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transitionName = ref('slide-right')
const isTransitioning = ref(false)

// Rastreamento de histórico para detectar direção
const navigationHistory = ref([])

watch(() => router.currentRoute.value, (to, from) => {
  if (!from || !from.name) return
  
  const toIndex = to.meta.index || 0
  const fromIndex = from.meta.index || 0
  
  if (toIndex > fromIndex) {
    transitionName.value = 'slide-right' // Avançando
  } else if (toIndex < fromIndex) {
    transitionName.value = 'slide-left' // Retornando
  } else {
    // Mesmo nível - verificar ordem no histórico
    const toPathIndex = navigationHistory.value.indexOf(to.path)
    const fromPathIndex = navigationHistory.value.indexOf(from.path)
    
    if (toPathIndex !== -1 && toPathIndex < fromPathIndex) {
      transitionName.value = 'slide-left' // Retornando
    } else {
      transitionName.value = 'slide-right' // Avançando
    }
  }
  
  // Atualizar histórico
  if (!navigationHistory.value.includes(to.path)) {
    navigationHistory.value.push(to.path)
  }
})

function onBeforeEnter() {
  isTransitioning.value = true
}

function onAfterEnter() {
  isTransitioning.value = false
}
</script>

<style>
/* Reset global para evitar barras duplas */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Container principal */
#app > div {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background-color: #380075;
}

/* Configuração comum para todas as transições */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 450ms cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform, opacity;
  z-index: 1;
}

/* Slide right (avançando - nova tela entra da direita) */
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

/* Slide left (retornando - nova tela entra da esquerda) */
.slide-left-enter-from {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Garantir que a tela que entra fique por cima na volta */
.slide-left-enter-active {
  z-index: 2;
}

/* Garantir performance em todos os dispositivos */
* {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>