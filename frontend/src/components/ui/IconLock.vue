<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" :stroke="liberado ? '#22c55e' : '#9ca3af'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path :d="liberado ? 'M7 11V7a5 5 0 0 1 9.9-1' : 'M7 11V7a5 5 0 0 1 10 0v4'" />
  </svg>
</template>

<script setup>
defineProps({
  liberado: { type: Boolean, default: false },
})
</script>
