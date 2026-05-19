import { useRouter } from 'vue-router'

export function useNavegacaoAula() {
  const router = useRouter()

  function irParaAula(fav) {
    router.push({
      name: 'Aula',
      params: {
        id: fav.id,
        titulo: fav.titulo,
        nivel: fav.nivel,
        progresso: fav.progresso || 0,
        videoId: fav.videoId || 'dQw4w9WgXcQ',
      },
      query: { desc: encodeURIComponent(fav.descricao || '') },
    })
  }

  return { irParaAula }
}
