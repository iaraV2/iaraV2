<template>
  <div :class="wrapperClass">
    <img src="/img/anjos.png" :alt="alt" :class="imgClass" />
  </div>
</template>

<script setup>
defineProps({
  wrapperClass: { type: String, default: '' },
  imgClass: { type: String, required: true },
  alt: { type: String, default: 'Anjos Digitais' },
})
</script>
