// src/services/turmaService.js

import {
    criarTurma, buscarTurmaPorId, buscarTurmaPorCodigo, buscarTurmasPorTitulo,
    listarTurmasDoProfessor, atualizarTurma, deletarTurma,
    adicionarAlunoNaTurma, buscarAlunoNaTurma, listarAlunosDaTurma,
    listarTurmasDoAluno, atualizarProgressoAluno,
    liberarAlunoParaProximaTurma, removerAlunoNaTurma,
    adicionarConteudo, listarConteudos, atualizarConteudo, deletarConteudo,
    salvarPdf, listarPdfs, buscarPdfCompleto, deletarPdf,
} from '../models/turmaModel.js';
import { uploadArquivoParaDrive } from './driveService.js';
import crypto from 'crypto';


// ─── Helper: gera código único no formato IARA-XXXX ──────────────────────────
function gerarCodigo() {
    return 'IARA-' + crypto.randomBytes(2).toString('hex').toUpperCase();
}


// ─── TURMAS ───────────────────────────────────────────────────────────────────

//! Cria turma — só professor pode chamar (verificado no middleware de role)
export const criarTurmaService = async (professorId, dados) => {
    const { nome, descricao, codigo: codigoEnviado, cor, icone, nivel } = dados;
    if (!nome || nome.trim().length < 3) {
        throw new Error('O nome da turma deve ter pelo menos 3 caracteres.');
    }

    let codigo = codigoEnviado?.trim()
        ? codigoEnviado.toUpperCase()
        : gerarCodigo();

    if (codigo.length < 4 || codigo.length > 20) {
        throw new Error('O código deve ter entre 4 e 20 caracteres.');
    }
    const existente = await buscarTurmaPorCodigo(codigo);
    if (existente) throw new Error('Este código já está em uso. Gere outro código.');

    const turmaId = await criarTurma({
        nome: nome.trim(),
        descricao,
        professorId,
        codigo,
        cor: cor || '#FFD700',
        icone: icone || '🌻',
        nivel: nivel || 'Iniciante',
        progresso: 0,
    });

    return {
        id: turmaId,
        nome: nome.trim(),
        codigo,
        cor: cor || '#FFD700',
        icone: icone || '🌻',
        nivel: nivel || 'Iniciante',
        progresso: 0,
        mensagem: `Turma criada! Código de convite: ${codigo}`,
    };
};

//! Professor edita o código (e/ou nome/descrição) da própria turma
export const editarTurmaService = async (professorId, turmaId, dados) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Você não tem permissão para editar esta turma.');

    const atualizacao = {};

    if (dados.nome) {
        if (dados.nome.trim().length < 3) throw new Error('Nome muito curto.');
        atualizacao.nome = dados.nome.trim();
    }

    if (dados.descricao !== undefined) atualizacao.descricao = dados.descricao;
    if (dados.cor !== undefined) atualizacao.cor = dados.cor;
    if (dados.icone !== undefined) atualizacao.icone = dados.icone;
    if (dados.nivel !== undefined) atualizacao.nivel = dados.nivel;
    if (dados.progresso !== undefined) atualizacao.progresso = dados.progresso;

    if (dados.codigo) {
        // Professor pode definir um código personalizado (ex: "IARA-TURMA1")
        const novoCodigo = dados.codigo.toUpperCase();
        if (novoCodigo.length < 4 || novoCodigo.length > 20) {
            throw new Error('O código deve ter entre 4 e 20 caracteres.');
        }
        // Verifica se já existe outra turma com esse código
        const existente = await buscarTurmaPorCodigo(novoCodigo);
        if (existente && existente.id !== turmaId) {
            throw new Error('Este código já está em uso por outra turma.');
        }
        atualizacao.codigo = novoCodigo;
    }

    if (!Object.keys(atualizacao).length) throw new Error('Nenhum dado válido para atualizar.');

    await atualizarTurma(turmaId, atualizacao);
    return { mensagem: 'Turma atualizada com sucesso.', ...atualizacao };
};

//! Lista turmas do professor autenticado
export const listarTurmasProfessorService = async (professorId) => {
    return await listarTurmasDoProfessor(professorId);
};

//! Deleta turma (só o professor dono pode)
export const deletarTurmaService = async (professorId, turmaId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    return await deletarTurma(turmaId);
};


// ─── ENTRADA DO ALUNO NA TURMA ────────────────────────────────────────────────

//! Aluno entra na turma pelo código
//  Regra: aluno pode entrar em qualquer turma digitando o código.
//  O código é solicitado apenas uma vez (controlado no frontend via localStorage).
export const entrarNaTurmaService = async (alunoId, codigo) => {
    // 1. Encontra a turma pelo código
    const turma = await buscarTurmaPorCodigo(codigo);
    if (!turma) throw new Error('Código de turma inválido ou turma inativa.');

    // 2. Verifica se o aluno já está nessa turma
    const vinculoExistente = await buscarAlunoNaTurma(turma.id, alunoId);
    if (vinculoExistente) throw new Error('Você já está matriculado nesta turma.');

    // 3. Matricula o aluno (sem restrição de progressão)
    await adicionarAlunoNaTurma(turma.id, alunoId);

    return {
        mensagem:  `Bem-vinda à turma "${turma.nome}"! 🎉`,
        turmaId:   turma.id,
        turmaNome: turma.nome,
    };
};

//! Lista todas as turmas em que o aluno está matriculado
export const listarTurmasAlunoService = async (alunoId) => {
    return await listarTurmasDoAluno(alunoId);
};

//! Busca turma por código (pública para alunos poderem buscar antes de entrar)
export const buscarTurmaPorCodigoPublicoService = async (codigo) => {
    const turma = await buscarTurmaPorCodigo(codigo);
    if (!turma) throw new Error('Turma não encontrada com este código.');
    return turma;
};

//! Busca turmas por título (pública para alunos poderem buscar antes de entrar)
export const buscarTurmasPorTituloPublicoService = async (titulo) => {
    if (!titulo || titulo.length < 2) {
        return [];
    }
    const turmas = await buscarTurmasPorTitulo(titulo);
    return turmas;
};

//! Lista todas as turmas públicas (ativas) para alunos
export const listarTodasTurmasPublicasService = async () => {
    const { db } = await import('../config/firebase.js');
    const snap = await db.collection('turmas').get();
    const turmas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filtra por turmas ativas no código após a busca
    return turmas.filter(t => t.ativa !== false);
};

//! Verifica se o aluno está em pelo menos uma turma ativa (usado pelo middleware)
export const alunoTemTurmaAtiva = async (alunoId) => {
    try {
        const { db } = await import('../config/firebase.js');
        const snap = await db.collection('usuarios').doc(alunoId)
            .collection('turmasMatriculadas').limit(1).get();
        return !snap.empty;
    } catch (error) {
        console.error('Erro ao verificar turma ativa:', error.message);
        return false;
    }
};


// ─── PROGRESSO DO ALUNO ───────────────────────────────────────────────────────

//! Atualiza o progresso do aluno (chamado quando ele conclui um conteúdo)
export const atualizarProgressoService = async (turmaId, alunoId, progressoPct) => {
    if (progressoPct < 0 || progressoPct > 100) throw new Error('Progresso deve ser entre 0 e 100.');
    await atualizarProgressoAluno(turmaId, alunoId, progressoPct);
    return { mensagem: 'Progresso atualizado.', progressoPct };
};

//! Professor libera aluno para entrar em novas turmas (após 80%+ de progresso)
export const liberarAlunoService = async (professorId, turmaId, alunoId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');

    const vinculo = await buscarAlunoNaTurma(turmaId, alunoId);
    if (!vinculo) throw new Error('Aluno não está nesta turma.');

    if (vinculo.progressoPct < 80) {
        throw new Error(
            `O aluno ainda não atingiu 80% de progresso. Progresso atual: ${vinculo.progressoPct}%.`
        );
    }

    await liberarAlunoParaProximaTurma(turmaId, alunoId);
    return { mensagem: 'Aluno liberado para entrar em novas turmas!' };
};

//! Professor lista os alunos da turma (com progresso)
export const listarAlunosService = async (professorId, turmaId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    return await listarAlunosDaTurma(turmaId);
};

//! Professor remove aluno da turma
export const removerAlunoService = async (professorId, turmaId, alunoId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    await removerAlunoNaTurma(turmaId, alunoId);
    return { mensagem: 'Aluno removido da turma.' };
};


// ─── CONTEÚDOS ────────────────────────────────────────────────────────────────

//! Professor adiciona conteúdo
export const adicionarConteudoService = async (professorId, turmaId, dados) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');

    const { titulo, descricao, link, ordem, topicos, pdfs, liberado, dataLancamento } = dados;
    if (!titulo || titulo.trim().length < 2) throw new Error('Título obrigatório.');
    if (!link || !link.startsWith('http')) throw new Error('Link externo inválido.');

    const id = await adicionarConteudo(turmaId, {
        titulo: titulo.trim(),
        descricao,
        link,
        ordem,
        topicos: topicos || [],
        pdfs: pdfs || [],
        liberado: liberado ?? true,
        dataLancamento: dataLancamento || null,
    });
    return { id, mensagem: 'Conteúdo adicionado com sucesso!' };
};

//! Lista conteúdos de uma turma (aluno ou professor autenticado)
export const listarConteudosService = async (turmaId, usuarioId, role) => {
    // Professor: precisa ser dono da turma
    if (role === 'professor') {
        const turma = await buscarTurmaPorId(turmaId);
        if (!turma) throw new Error('Turma não encontrada.');
        if (turma.professorId !== usuarioId) throw new Error('Sem permissão.');
    }

    // Aluno: pode acessar conteúdos de qualquer turma pública (sem necessidade de matrícula)
    // A verificação de matrícula foi removida para permitir acesso a todas as turmas criadas por professores
    if (role === 'aluno') {
        const turma = await buscarTurmaPorId(turmaId);
        if (!turma) throw new Error('Turma não encontrada.');
        // Verifica apenas se a turma está ativa
        if (turma.ativa === false) throw new Error('Turma inativa.');
    }

    return await listarConteudos(turmaId);
};

//! Professor edita conteúdo
export const editarConteudoService = async (professorId, turmaId, conteudoId, dados) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');

    const atualizacao = {};
    if (dados.titulo)                  atualizacao.titulo          = dados.titulo.trim();
    if (dados.descricao !== undefined) atualizacao.descricao       = dados.descricao;
    if (dados.link)                    atualizacao.link            = dados.link;
    if (dados.ordem !== undefined)     atualizacao.ordem           = dados.ordem;
    if (dados.topicos !== undefined)   atualizacao.topicos         = dados.topicos;
    if (dados.pdfs !== undefined)      atualizacao.pdfs            = dados.pdfs;
    if (dados.liberado !== undefined)  atualizacao.liberado        = dados.liberado;
    if (dados.dataLancamento !== undefined) atualizacao.dataLancamento = dados.dataLancamento;

    if (!Object.keys(atualizacao).length) throw new Error('Nada para atualizar.');
    return await atualizarConteudo(turmaId, conteudoId, atualizacao);
};

//! Professor remove conteúdo
export const deletarConteudoService = async (professorId, turmaId, conteudoId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    return await deletarConteudo(turmaId, conteudoId);
};

// ─── PDFs ─────────────────────────────────────────────────────────────────────

const MAX_PDF_BYTES = 700 * 1024;

export const uploadPdfService = async (professorId, turmaId, conteudoId, arquivo) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    if (!arquivo) throw new Error('Nenhum arquivo enviado.');
    if (!arquivo.buffer?.length) throw new Error('Arquivo corrompido ou vazio.');
    if (arquivo.mimetype !== 'application/pdf') throw new Error('Formato inválido. Envie apenas PDF.');
    const nomeArq = (arquivo.originalname || '').toLowerCase();
    if (!nomeArq.endsWith('.pdf')) throw new Error('A extensão do arquivo deve ser .pdf');
    if (arquivo.size > MAX_PDF_BYTES) throw new Error('PDF muito grande. Máximo permitido: 700KB.');

    const base64 = arquivo.buffer.toString('base64');
    const tamanhoEstimadoDoc = Math.ceil(base64.length * 1.05) + 500;
    if (tamanhoEstimadoDoc > 1_048_576) {
        throw new Error('PDF excede o limite do banco de dados. Use arquivos menores (até 700KB).');
    }

    const id = await salvarPdf(turmaId, conteudoId, {
        nome: arquivo.originalname,
        base64,
        tamanho: arquivo.size,
    });

    // --- INTEGRAÇÃO GOOGLE DRIVE ---
    // Copia o arquivo para o Google Drive para que a IAra possa processar
    const folderId = process.env.DRIVE_FOLDER_ID || '108BCKchtHnFuVZKFXUjlDZi6fVxs_5oD';
    
    try {
        const driveFileId = await uploadArquivoParaDrive(arquivo.buffer, arquivo.originalname, folderId);
        if (driveFileId) {
            console.log(`📂 [SYNC] PDF "${arquivo.originalname}" sincronizado com Drive. ID: ${driveFileId}`);
        } else {
            console.warn(`⚠️ [SYNC] Falha ao sincronizar "${arquivo.originalname}" com Drive (ID não retornado).`);
        }
    } catch (err) {
        console.error(`❌ [SYNC] Erro crítico na sincronização com Drive para "${arquivo.originalname}":`, err);
    }

    return { id, nome: arquivo.originalname, tamanho: arquivo.size, mensagem: 'PDF enviado com sucesso!' };
};

export const listarPdfsService = async (turmaId, conteudoId) => {
    return await listarPdfs(turmaId, conteudoId);
};

export const baixarPdfService = async (turmaId, conteudoId, pdfId) => {
    return await buscarPdfCompleto(turmaId, conteudoId, pdfId);
};

export const deletarPdfService = async (professorId, turmaId, conteudoId, pdfId) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');
    return await deletarPdf(turmaId, conteudoId, pdfId);
};