import { ref } from 'vue'

const favoritos = ref([])
let initialized = false

function carregarFavoritos() {
  try {
    const favs = localStorage.getItem('favoritos')
    favoritos.value = favs ? JSON.parse(favs) : []
  } catch (e) {
    console.error('Erro ao carregar favoritos:', e)
    favoritos.value = []
  }
}

export function useFavoritos() {
  if (!initialized) {
    carregarFavoritos()
    initialized = true
  }

  function salvarFavoritos() {
    try {
      localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e)
    }
  }

  function removerFavorito(id) {
    const index = favoritos.value.findIndex((f) => f.id === id)
    if (index > -1) {
      favoritos.value.splice(index, 1)
      salvarFavoritos()
    }
  }

  return { favoritos, carregarFavoritos, salvarFavoritos, removerFavorito }
}
