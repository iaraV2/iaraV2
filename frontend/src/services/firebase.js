const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return sessionStorage.getItem('iara_token')
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
    body: JSON.stringify({
      nome: turma.titulo,
      descricao: turma.descricao || '',
      codigo: turma.codigo || undefined,
      cor: turma.cor,
      icone: turma.icone,
      nivel: turma.nivel,
    }),
  })
  const data = await handleResponse(res)
  return {
    id: data.id,
    titulo: turma.titulo,
    codigo: data.codigo,
    cor: data.cor || turma.cor,
    icone: data.icone || turma.icone,
    nivel: data.nivel || turma.nivel,
    progresso: data.progresso ?? 0,
  }
}

export async function buscarTurmaPorCodigo(codigo) {
  const res = await fetch(`${BASE_URL}/iara/turmas/buscar/${codigo.toUpperCase()}`)
  const data = await handleResponse(res)
  return data || null
}


export async function buscarTurmaPorId(id) {
  const usuarioStr = sessionStorage.getItem('iara_usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
  const role = usuario?.role || 'aluno'
  
  // Para alunos, usa o endpoint de turmas públicas e filtra pelo ID
  // Para professores, usa o endpoint de turmas do professor
  const endpoint = role === 'aluno' ? '/iara/turmas/todas-publicas' : '/iara/turmas/minhas'
  const res = await fetch(`${BASE_URL}${endpoint}`, { headers: headers() })
  const turmas = await handleResponse(res)
  return turmas.find(t => t.id === id) || null
}

export async function buscarTodasTurmas() {
  const usuarioStr = sessionStorage.getItem('iara_usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
  const role = usuario?.role || 'aluno'
  // Alunos veem todas as turmas do banco de dados (incluindo as criadas por professores)
  const endpoint = role === 'aluno' ? '/iara/turmas/todas-publicas' : '/iara/turmas/minhas'
  const res = await fetch(`${BASE_URL}${endpoint}`, { headers: headers() })
  return handleResponse(res)
}

export async function buscarMinhasTurmasAluno() {
  const res = await fetch(`${BASE_URL}/iara/turmas/minhas-turmas`, { headers: headers() })
  return handleResponse(res)
}

export async function atualizarTurma(id, dados) {
  const res = await fetch(`${BASE_URL}/iara/turmas/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      nome: dados.titulo,
      descricao: dados.descricao,
      cor: dados.cor,
      icone: dados.icone,
      nivel: dados.nivel,
      progresso: dados.progresso,
      codigo: dados.codigo,
    }),
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
      dataLancamento: aula.dataLancamento || null,
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
      ordem: aula.ordem ?? 0,
      topicos: aula.topicos || [],
      pdfs: [],
      liberado: aula.liberado ?? true,
      dataLancamento: aula.dataLancamento || null,
    }),
  })
  return handleResponse(res)
}

export function mapearTurmaParaCard(t) {
  return {
    ...t,
    id: t.id,
    titulo: t.nome || t.titulo,
    progresso: t.progresso ?? 0,
    cor: t.cor || '#FFD700',
    icone: t.icone || '🌻',
    nivel: t.nivel || 'Iniciante',
    aulasSemana: t.aulasSemana || [],
  }
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
export async function buscarTurmasPorTitulo(titulo) {
  // Garantimos que a URL está perfeitamente limpa
  const url = `${BASE_URL}/iara/turmas/buscar-por-titulo/${encodeURIComponent(titulo)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: headers() // Injeta corretamente o Content-Type e o Token do Aluno
  });

  const dados = await handleResponse(res);

  // Mapeia os campos vindos do banco ('nome') para o formato que o seu componente Vue precisa ('titulo')
  return (dados || []).map(t => ({
    id: t.id,
    titulo: t.nome || 'Turma Sem Nome', // Transforma 'nome' do Firestore em 'titulo' para o Vue
    descricao: t.descricao || '',
    codigo: t.codigo || '',
    cor: t.cor || '#420583',
    icone: t.icone || '🏫',
    nivel: t.nivel || 'Iniciante',
    progresso: t.progresso ?? 0
  }));
}

// ─── PROGRESSO DE AULAS ─────────────────────────────────────────────────────

export async function salvarProgressoAula(turmaId, conteudoId, progressoData) {
  const usuarioStr = sessionStorage.getItem('iara_usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
  if (!usuario) throw new Error('Usuário não autenticado')

  const res = await fetch(`${BASE_URL}/iara/progresso`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      turmaId,
      conteudoId,
      usuarioId: usuario.id,
      ...progressoData
    }),
  })
  return handleResponse(res)
}

export async function buscarProgressoAula(turmaId, conteudoId) {
  const usuarioStr = sessionStorage.getItem('iara_usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
  if (!usuario) return progressoPadrao()

  try {
    const res = await fetch(`${BASE_URL}/iara/progresso/${turmaId}/${conteudoId}/${usuario.id}`, {
      headers: headers()
    })
    if (!res.ok) return progressoPadrao()
    return handleResponse(res)
  } catch {
    return progressoPadrao()
  }
}

export async function buscarProgressoTurma(turmaId) {
  const usuarioStr = sessionStorage.getItem('iara_usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
  if (!usuario) return { progressoPorAula: {}, progressoPct: 0 }

  try {
    const res = await fetch(`${BASE_URL}/iara/progresso/turma/${turmaId}/${usuario.id}`, {
      headers: headers()
    })
    if (!res.ok) return { progressoPorAula: {}, progressoPct: 0 }
    return handleResponse(res)
  } catch {
    return { progressoPorAula: {}, progressoPct: 0 }
  }
}

function progressoPadrao() {
  return {
    videoAssistido: false,
    pdfVisualizado: false,
    pdfBaixado: false,
    concluidoManual: false,
    progresso: 0,
  }
}

export async function zerarProgressoProfessor() {
  const res = await fetch(`${BASE_URL}/iara/progresso/professor/zerar`, {
    method: 'DELETE',
    headers: headers()
  })
  return handleResponse(res)
}