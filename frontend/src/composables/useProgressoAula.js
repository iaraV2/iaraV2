const ETAPA = 100 / 3

export function calcularProgressoAula(progresso, { temPdf = true } = {}) {
  if (progresso?.concluidoManual) return 100

  if (!temPdf) {
    return progresso?.videoAssistido ? 100 : 0
  }

  let total = 0
  if (progresso?.videoAssistido) total += ETAPA
  if (progresso?.pdfVisualizado) total += ETAPA
  if (progresso?.pdfBaixado) total += ETAPA

  return Math.min(Math.round(total * 100) / 100, 100)
}

export function calcularProgressoTurma(aulas) {
  if (!aulas?.length) return 0

  const soma = aulas.reduce((acc, aula) => {
    const prog = aula.progressoAula?.progresso ?? calcularProgressoAula(aula.progressoAula)
    return acc + prog
  }, 0)

  return Math.min(Math.round((soma / aulas.length) * 100) / 100, 100)
}

export function estiloBordaProgresso(progresso) {
  const pct = progresso ?? 0

  if (pct >= 100) {
    return {
      background: 'linear-gradient(135deg, #22c55e, #4ade80, #16a34a, #4ade80, #22c55e)',
      backgroundSize: '300% 300%',
    }
  }

  if (pct <= 0) {
    return { background: '#ffffff' }
  }

  return {
    background: `conic-gradient(#22c55e 0% ${pct}%, #e5e7eb ${pct}% 100%)`,
    boxShadow: pct > 0 ? '0 0 8px rgba(34, 197, 94, 0.35)' : 'none',
  }
}

export function progressoPadrao() {
  return {
    videoAssistido: false,
    pdfVisualizado: false,
    pdfBaixado: false,
    concluidoManual: false,
    progresso: 0,
  }
}