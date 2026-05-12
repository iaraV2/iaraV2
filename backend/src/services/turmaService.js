// src/services/turmaService.js

import {
    criarTurma, buscarTurmaPorId, buscarTurmaPorCodigo,
    listarTurmasDoProfessor, atualizarTurma, deletarTurma,
    adicionarAlunoNaTurma, buscarAlunoNaTurma, listarAlunosDaTurma,
    listarTurmasDoAluno, atualizarProgressoAluno,
    liberarAlunoParaProximaTurma, removerAlunoNaTurma,
    adicionarConteudo, listarConteudos, atualizarConteudo, deletarConteudo,
} from '../models/turmaModel.js';
import crypto from 'crypto';


// ─── Helper: gera código único no formato IARA-XXXX ──────────────────────────
function gerarCodigo() {
    return 'IARA-' + crypto.randomBytes(2).toString('hex').toUpperCase();
}


// ─── TURMAS ───────────────────────────────────────────────────────────────────

//! Cria turma — só professor pode chamar (verificado no middleware de role)
export const criarTurmaService = async (professorId, dados) => {
    const { nome, descricao } = dados;
    if (!nome || nome.trim().length < 3) {
        throw new Error('O nome da turma deve ter pelo menos 3 caracteres.');
    }

    const codigo = gerarCodigo();

    const turmaId = await criarTurma({ nome: nome.trim(), descricao, professorId, codigo });

    return {
        id:      turmaId,
        nome,
        codigo,
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
//  Regra: pode entrar em múltiplas turmas, MAS só se o professor tiver liberado
//  (campo "liberado: true" na turma anterior) OU se for sua primeira turma.
export const entrarNaTurmaService = async (alunoId, codigo) => {
    // 1. Encontra a turma pelo código
    const turma = await buscarTurmaPorCodigo(codigo);
    if (!turma) throw new Error('Código de turma inválido ou turma inativa.');

    // 2. Verifica se o aluno já está nessa turma
    const vinculoExistente = await buscarAlunoNaTurma(turma.id, alunoId);
    if (vinculoExistente) throw new Error('Você já está matriculado nesta turma.');

    // 3. Verifica a regra de progressão sem collectionGroup
    const { db } = await import('../config/firebase.js');
    const snapTurmas = await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').limit(1).get();

    if (!snapTurmas.empty) {
        const turmasMatSnap = await db.collection('usuarios').doc(alunoId)
            .collection('turmasMatriculadas').get();

        let temLiberacao = false;
        for (const turmaDoc of turmasMatSnap.docs) {
            const tid = turmaDoc.id;
            const alunoNaTurma = await buscarAlunoNaTurma(tid, alunoId);
            if (alunoNaTurma?.liberado === true) {
                temLiberacao = true;
                break;
            }
        }

        if (!temLiberacao) {
            throw new Error(
                'Para entrar em uma nova turma, você precisa completar pelo menos 80% do conteúdo ' +
                'de uma turma atual e ser liberado pelo professor.'
            );
        }
    }

    // 4. Matricula o aluno
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

    const { titulo, descricao, link, ordem } = dados;
    if (!titulo || titulo.trim().length < 2) throw new Error('Título obrigatório.');
    if (!link || !link.startsWith('http')) throw new Error('Link externo inválido.');

    const id = await adicionarConteudo(turmaId, { titulo: titulo.trim(), descricao, link, ordem });
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

    // Aluno: precisa estar matriculado na turma
    if (role === 'aluno') {
        const vinculo = await buscarAlunoNaTurma(turmaId, usuarioId);
        if (!vinculo) throw new Error('Você não está matriculado nesta turma.');
    }

    return await listarConteudos(turmaId);
};

//! Professor edita conteúdo
export const editarConteudoService = async (professorId, turmaId, conteudoId, dados) => {
    const turma = await buscarTurmaPorId(turmaId);
    if (!turma) throw new Error('Turma não encontrada.');
    if (turma.professorId !== professorId) throw new Error('Sem permissão.');

    const atualizacao = {};
    if (dados.titulo)     atualizacao.titulo     = dados.titulo.trim();
    if (dados.descricao !== undefined) atualizacao.descricao = dados.descricao;
    if (dados.link)       atualizacao.link        = dados.link;
    if (dados.ordem !== undefined) atualizacao.ordem = dados.ordem;

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