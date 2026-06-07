const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('iara_token')
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    console.error('Erro do backend:', res.status, data)
    throw new Error(data.erro || 'Erro na requisição')
  }
  return data
}

// ─── TURMAS ──────────────────────────────────────────────────────────────────

export async function salvarTurma(turma) {
  const res = await fetch(`${BASE_URL}/iara/turmas`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ nome: turma.titulo, descricao: turma.descricao || '' })
  })
  const data = await handleResponse(res)
  return {
    id: data.id, titulo: turma.titulo, codigo: data.codigo,
    cor: turma.cor, icone: turma.icone, nivel: turma.nivel, progresso: 0
  }
}

export async function buscarTurmaPorCodigo(codigo) {
  const res = await fetch(`${BASE_URL}/iara/turmas/minhas`, { headers: headers() })
  const turmas = await handleResponse(res)
  return turmas.find(t => t.codigo === codigo.toUpperCase()) || null
}

export async function buscarTurmaPorId(id) {
  const res = await fetch(`${BASE_URL}/iara/turmas/minhas`, { headers: headers() })
  const turmas = await handleResponse(res)
  return turmas.find(t => t.id === id) || null
}

export async function buscarTodasTurmas() {
  const res = await fetch(`${BASE_URL}/iara/turmas/minhas`, { headers: headers() })
  return handleResponse(res)
}

export async function atualizarTurma(id, dados) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ nome: dados.titulo, descricao: dados.descricao })
  })
  return handleResponse(res)
}

export async function excluirTurma(id) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${id}`, {
    method: 'DELETE', headers: headers()
  })
  return handleResponse(res)
}

// ─── AULAS (conteúdos) ───────────────────────────────────────────────────────

export async function salvarAulaNaTurma(turmaId, aula) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      titulo: aula.titulo,
      descricao: aula.descricao || '',
      link: aula.videoId ? `https://www.youtube.com/watch?v=${aula.videoId}` : '',
      ordem: aula.ordem ?? 0,
      topicos: aula.topicos || [],
      pdfs: [],
      liberado: aula.liberado ?? true,
    }),
  })
  return handleResponse(res)
}

export async function salvarAula(aula) {
  const turmaId = aula.turmaId
    || (await buscarTurmaPorCodigo(aula.turmaCodigo))?.id
  if (!turmaId) throw new Error('Turma não encontrada para salvar aula')

  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      titulo: aula.titulo,
      descricao: aula.descricao || '',
      link: aula.videoId ? `https://www.youtube.com/watch?v=${aula.videoId}` : '',
      ordem: 0,
      topicos: aula.topicos || [],
      pdfs: [],
      liberado: aula.liberado ?? true,
    })
  })
  return handleResponse(res)
}

export async function buscarAulasPorTurmaCodigo(turmaCodigo) {
  const turma = await buscarTurmaPorCodigo(turmaCodigo)
  if (!turma) throw new Error('Turma não encontrada')
  return buscarAulasPorTurmaId(turma.id)
}

export async function buscarAulasPorTurmaId(turmaId) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos`, { headers: headers() })
  return handleResponse(res)
}

export async function buscarAulaPorId(turmaId, conteudoId) {
  const aulas = await buscarAulasPorTurmaId(turmaId)
  return aulas.find(a => a.id === conteudoId) || null
}

export async function atualizarAula(turmaId, conteudoId, dados) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(dados)
  })
  return handleResponse(res)
}

export async function excluirAula(turmaId, conteudoId) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}`, {
    method: 'DELETE', headers: headers()
  })
  return handleResponse(res)
}

// ─── PDFs ────────────────────────────────────────────────────────────────────

export async function uploadPdf(turmaId, conteudoId, arquivo) {
  const formData = new FormData()
  formData.append('pdf', arquivo)
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}/pdfs`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  })
  return handleResponse(res)
}

export async function listarPdfs(turmaId, conteudoId) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}/pdfs`, {
    headers: headers()
  })
  return handleResponse(res)
}

export async function obterPdfBlob(turmaId, conteudoId, pdfId) {
  const res = await fetch(
    `${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}/pdfs/${pdfId}/download`,
    { headers: { 'Authorization': `Bearer ${getToken()}` } }
  )
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.erro || 'Erro ao baixar PDF')
  }
  return res.blob()
}

export async function baixarPdf(turmaId, conteudoId, pdfId, nome) {
  const blob = await obterPdfBlob(turmaId, conteudoId, pdfId)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  URL.revokeObjectURL(url)
}

export async function deletarPdf(turmaId, conteudoId, pdfId) {
  const res = await fetch(
    `${BASE_URL}/iara/turmas/${turmaId}/conteudos/${conteudoId}/pdfs/${pdfId}`,
    { method: 'DELETE', headers: headers() }
  )
  return handleResponse(res)
}