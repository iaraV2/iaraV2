<template>
  <button type="button" :class="buttonClass" @click="$emit('click')">
    <IconChevronLeft />
  </button>
</template>

<script setup>
import IconChevronLeft from './IconChevronLeft.vue'

defineProps({
  buttonClass: { type: String, required: true },
})
defineEmits(['click'])
</script>
