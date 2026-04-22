// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// ─── Pinia PRECISA ser registrado ANTES do router ─────────────────────────
// O router/index.js usa useAuthStore() no beforeEach.
// Se o Pinia não estiver registrado antes, a store não existe ainda
// e o guard quebraria com erro "getActivePinia() was called with no active Pinia".
const pinia = createPinia()
app.use(pinia)     // 1º Pinia
app.use(router)    // 2º Router (já pode usar as stores nos guards)

app.mount('#app')