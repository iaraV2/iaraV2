
import { db } from '../config/firebase.js';
import { admin } from '../config/firebase.js';

const COLECAO = 'turmas';


// ─── TURMAS ───────────────────────────────────────────────────────────────────

//! Cria uma nova turma
export const criarTurma = async (dados) => {
    const ref = await db.collection(COLECAO).add({
        nome:        dados.nome,
        descricao:   dados.descricao || null,
        professorId: dados.professorId,
        codigo:      dados.codigo,          // ex: "IARA-4F2A"
        ativa:       true,
        criadaEm:    admin.firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
};

//! Busca turma pelo ID
export const buscarTurmaPorId = async (turmaId) => {
    const doc = await db.collection(COLECAO).doc(turmaId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

//! Busca turma pelo código de convite (case-insensitive via upper)
export const buscarTurmaPorCodigo = async (codigo) => {
    const snap = await db.collection(COLECAO)
        .where('codigo', '==', codigo.toUpperCase())
        .where('ativa', '==', true)
        .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
};

//! Lista todas as turmas de um professor
export const listarTurmasDoProfessor = async (professorId) => {
    const snap = await db.collection(COLECAO)
        .where('professorId', '==', professorId)
        .orderBy('criadaEm', 'desc')
        .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//! Atualiza dados da turma (nome, descrição, código)
export const atualizarTurma = async (turmaId, dados) => {
    await db.collection(COLECAO).doc(turmaId).update(dados);
    return { message: 'Turma atualizada com sucesso.' };
};

//! Deleta turma
export const deletarTurma = async (turmaId) => {
    await db.collection(COLECAO).doc(turmaId).delete();
    return { message: 'Turma deletada.' };
};


// ─── ALUNOS DA TURMA ─────────────────────────────────────────────────────────

//! Vincula aluno à turma (subcoleção turmas/{id}/alunos)
export const adicionarAlunoNaTurma = async (turmaId, alunoId) => {
    const dadosMatricula = {
        alunoId,
        entradoEm:    admin.firestore.FieldValue.serverTimestamp(),
        progressoPct: 0,
        liberado:     false,
    };

    // Salva na subcoleção da turma
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).set(dadosMatricula);

    // Salva também no documento do aluno para consulta rápida sem collectionGroup
    await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').doc(turmaId).set({
            turmaId,
            entradoEm: admin.firestore.FieldValue.serverTimestamp(),
        });
};

//! Busca o vínculo aluno-turma
export const buscarAlunoNaTurma = async (turmaId, alunoId) => {
    const doc = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).get();
    if (!doc.exists) return null;
    return doc.data();
};

//! Lista todos os alunos de uma turma
export const listarAlunosDaTurma = async (turmaId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').orderBy('entradoEm', 'asc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//! Lista todas as turmas em que um aluno está matriculado
export const listarTurmasDoAluno = async (alunoId) => {
    // CollectionGroup query: busca em TODAS as subcoleções "alunos" do Firestore
    const snap = await db.collectionGroup('alunos')
        .where('alunoId', '==', alunoId)
        .get();

    // Para cada vínculo, busca os dados da turma pai
    const turmas = await Promise.all(
        snap.docs.map(async (doc) => {
            const turmaId  = doc.ref.parent.parent.id;
            const turmaDoc = await db.collection(COLECAO).doc(turmaId).get();
            return { turmaId, ...doc.data(), turma: { id: turmaDoc.id, ...turmaDoc.data() } };
        })
    );
    return turmas;
};

//! Atualiza o progresso do aluno em uma turma (0-100)
export const atualizarProgressoAluno = async (turmaId, alunoId, progressoPct) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .update({ progressoPct });
};

//! Professor libera aluno para próxima turma
export const liberarAlunoParaProximaTurma = async (turmaId, alunoId) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .update({ liberado: true });
};

//! Remove aluno da turma
export const removerAlunoNaTurma = async (turmaId, alunoId) => {
    // Remove da subcoleção da turma
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).delete();

    // Remove também do turmasMatriculadas do aluno
    await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').doc(turmaId).delete();
};


// ─── CONTEÚDOS DA TURMA ───────────────────────────────────────────────────────

//! Adiciona conteúdo (título + link externo)
export const adicionarConteudo = async (turmaId, dados) => {
    const ref = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').add({
            titulo:    dados.titulo,
            descricao: dados.descricao || null,
            link:      dados.link,           // URL externa (YouTube, Drive, etc.)
            ordem:     dados.ordem || 0,     // para ordenar os conteúdos na tela
            criadoEm:  admin.firestore.FieldValue.serverTimestamp(),
        });
    return ref.id;
};

//! Lista todos os conteúdos de uma turma, ordenados
export const listarConteudos = async (turmaId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').orderBy('ordem', 'asc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//! Atualiza um conteúdo
export const atualizarConteudo = async (turmaId, conteudoId, dados) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId).update(dados);
    return { message: 'Conteúdo atualizado.' };
};

//! Remove um conteúdo
export const deletarConteudo = async (turmaId, conteudoId) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId).delete();
    return { message: 'Conteúdo removido.' };
};

//! Verifica rápida se aluno tem alguma turma (sem collectionGroup)
export const alunoTemTurmasMatriculadas = async (alunoId) => {
    const snap = await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').limit(1).get();
    return !snap.empty;
};