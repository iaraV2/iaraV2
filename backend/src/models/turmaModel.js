import { db } from '../config/firebase.js';
import { admin } from '../config/firebase.js';

const COLECAO = 'turmas';
const BATCH_SIZE = 100;

async function esvaziarColecao(ref) {
    let snap = await ref.limit(BATCH_SIZE).get();
    while (!snap.empty) {
        const batch = db.batch();
        snap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        snap = await ref.limit(BATCH_SIZE).get();
    }
}

async function deletarPdfsDoConteudo(turmaId, conteudoId) {
    await esvaziarColecao(
        db.collection(COLECAO).doc(turmaId)
            .collection('conteudos').doc(conteudoId)
            .collection('pdfs')
    );
}

async function deletarTodosConteudos(turmaId) {
    const conteudosSnap = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').get();
    for (const doc of conteudosSnap.docs) {
        await deletarPdfsDoConteudo(turmaId, doc.id);
        await doc.ref.delete();
    }
}

async function deletarTodosAlunos(turmaId) {
    const alunosSnap = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').get();
    for (const doc of alunosSnap.docs) {
        await db.collection('usuarios').doc(doc.id)
            .collection('turmasMatriculadas').doc(turmaId).delete()
            .catch(() => {});
        await doc.ref.delete();
    }
}

// ─── TURMAS ───────────────────────────────────────────────────────────────────

export const criarTurma = async (dados) => {
    const ref = await db.collection(COLECAO).add({
        nome:            dados.nome,
        nome_procuravel: dados.nome.toLowerCase(), // 🔥 Adicionado para permitir busca case-insensitive
        descricao:       dados.descricao || null,
        professorId:     dados.professorId,
        codigo:          dados.codigo,
        cor:             dados.cor || '#FFD700',
        icone:           dados.icone || '🌻',
        nivel:           dados.nivel || 'Iniciante',
        progresso:       dados.progresso ?? 0,
        ativa:           true,
        criadaEm:        admin.firestore.FieldValue.serverTimestamp(),
    });
    return ref.id;
};

export const buscarTurmaPorId = async (turmaId) => {
    const doc = await db.collection(COLECAO).doc(turmaId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const buscarTurmaPorCodigo = async (codigo) => {
    const snap = await db.collection(COLECAO)
        .where('codigo', '==', codigo.toUpperCase())
        .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const turma = { id: doc.id, ...doc.data() };
    // Filtra por turma ativa no código após a busca
    return turma.ativa !== false ? turma : null;
};
export const buscarTurmasPorTitulo = async (termo) => {
    const termoMinusculo = termo.toLowerCase();
    const snap = await db.collection(COLECAO)
        .where('nome_procuravel', '>=', termoMinusculo)
        .where('nome_procuravel', '<=', termoMinusculo + '\uf8ff')
        .get();

    // Filtra por turmas ativas no código após a busca
    return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(turma => turma.ativa !== false);
};
export const listarTurmasDoProfessor = async (professorId) => {
    const snap = await db.collection(COLECAO)
        .where('professorId', '==', professorId)
        .get();

    const turmas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return turmas.sort((a, b) => {
        const dataA = a.criadaEm?.toDate ? a.criadaEm.toDate() : new Date(0);
        const dataB = b.criadaEm?.toDate ? b.criadaEm.toDate() : new Date(0);
        return dataB - dataA; 
    });
};
export const atualizarTurma = async (turmaId, dados) => {
    await db.collection(COLECAO).doc(turmaId).update(dados);
    return { message: 'Turma atualizada com sucesso.' };
};

export const deletarTurma = async (turmaId) => {
    await deletarTodosConteudos(turmaId);
    await deletarTodosAlunos(turmaId);
    await db.collection(COLECAO).doc(turmaId).delete();
    return { message: 'Turma e aulas vinculadas removidas.' };
};

// ─── ALUNOS DA TURMA ─────────────────────────────────────────────────────────

export const adicionarAlunoNaTurma = async (turmaId, alunoId) => {
    const dadosMatricula = {
        alunoId,
        entradoEm:    admin.firestore.FieldValue.serverTimestamp(),
        progressoPct: 0,
        liberado:     false,
    };
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).set(dadosMatricula);
    await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').doc(turmaId).set({
            turmaId,
            entradoEm: admin.firestore.FieldValue.serverTimestamp(),
        });
};

export const buscarAlunoNaTurma = async (turmaId, alunoId) => {
    const doc = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).get();
    if (!doc.exists) return null;
    return doc.data();
};

export const listarAlunosDaTurma = async (turmaId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').orderBy('entradoEm', 'asc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const listarTurmasDoAluno = async (alunoId) => {
    const snap = await db.collectionGroup('alunos')
        .where('alunoId', '==', alunoId)
        .get();
    const turmas = await Promise.all(
        snap.docs.map(async (doc) => {
            const turmaId  = doc.ref.parent.parent.id;
            const turmaDoc = await db.collection(COLECAO).doc(turmaId).get();
            return { turmaId, ...doc.data(), turma: { id: turmaDoc.id, ...turmaDoc.data() } };
        })
    );
    return turmas;
};

export const atualizarProgressoAluno = async (turmaId, alunoId, progressoPct) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .update({ progressoPct });
};

export const liberarAlunoParaProximaTurma = async (turmaId, alunoId) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .update({ liberado: true });
};

export const removerAlunoNaTurma = async (turmaId, alunoId) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId).delete();
    await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').doc(turmaId).delete();
};

// ─── CONTEÚDOS DA TURMA ───────────────────────────────────────────────────────

export const adicionarConteudo = async (turmaId, dados) => {
    const ref = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').add({
            titulo:          dados.titulo,
            descricao:       dados.descricao || null,
            link:            dados.link,
            ordem:           dados.ordem ?? 0,
            topicos:         dados.topicos || [],
            pdfs:            dados.pdfs || [],
            liberado:        dados.liberado ?? true,
            dataLancamento:  dados.dataLancamento || null,
            criadoEm:        admin.firestore.FieldValue.serverTimestamp(),
        });
    return ref.id;
};

export const listarConteudos = async (turmaId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').orderBy('ordem', 'asc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const atualizarConteudo = async (turmaId, conteudoId, dados) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId).update(dados);
    return { message: 'Conteúdo atualizado.' };
};

export const deletarConteudo = async (turmaId, conteudoId) => {
    await deletarPdfsDoConteudo(turmaId, conteudoId);
    await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId).delete();
    return { message: 'Conteúdo removido.' };
};

export const alunoTemTurmasMatriculadas = async (alunoId) => {
    const snap = await db.collection('usuarios').doc(alunoId)
        .collection('turmasMatriculadas').limit(1).get();
    return !snap.empty;
};

// ─── PDFs DO CONTEÚDO ─────────────────────────────────────────────────────────

export const salvarPdf = async (turmaId, conteudoId, dados) => {
    const conteudoDoc = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId).get();
    if (!conteudoDoc.exists) {
        throw new Error('Aula (conteúdo) não encontrada para vincular o PDF.');
    }

    const payload = {
        nome:     dados.nome,
        base64:   dados.base64,
        tamanho:  dados.tamanho,
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        const ref = await db.collection(COLECAO).doc(turmaId)
            .collection('conteudos').doc(conteudoId)
            .collection('pdfs').add(payload);
        return ref.id;
    } catch (err) {
        if (err.code === 3 || /longer than|bytes/i.test(err.message || '')) {
            throw new Error('PDF excede o limite do banco de dados. Use arquivos de até 700KB.');
        }
        throw err;
    }
};

export const listarPdfs = async (turmaId, conteudoId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId)
        .collection('pdfs').orderBy('criadoEm', 'asc').get();
    return snap.docs.map(doc => ({
        id:      doc.id,
        nome:    doc.data().nome,
        tamanho: doc.data().tamanho,
    }));
};

export const buscarPdfCompleto = async (turmaId, conteudoId, pdfId) => {
    const doc = await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId)
        .collection('pdfs').doc(pdfId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const deletarPdf = async (turmaId, conteudoId, pdfId) => {
    await db.collection(COLECAO).doc(turmaId)
        .collection('conteudos').doc(conteudoId)
        .collection('pdfs').doc(pdfId).delete();
    return { message: 'PDF removido.' };
};