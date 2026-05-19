import { ref, onMounted } from 'vue'

export function useFavoritos({ carregarAoMontar = true } = {}) {
  const favoritos = ref([])

  function carregarFavoritos() {
    const favs = localStorage.getItem('favoritos')
    favoritos.value = favs ? JSON.parse(favs) : []
  }

  function salvarFavoritos() {
    localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
  }

  function removerFavorito(id) {
    const index = favoritos.value.findIndex((f) => f.id === id)
    if (index > -1) {
      favoritos.value.splice(index, 1)
      salvarFavoritos()
    }
  }

  if (carregarAoMontar) {
    onMounted(carregarFavoritos)
  }

  return { favoritos, carregarFavoritos, salvarFavoritos, removerFavorito }
}
