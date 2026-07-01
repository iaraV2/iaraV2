import { db } from '../config/firebase.js';
import { admin } from '../config/firebase.js';
import { listarConteudos, atualizarProgressoAluno, listarPdfs } from './turmaModel.js';

const COLECAO = 'turmas';

function calcularProgressoAula({ videoAssistido, pdfVisualizado, pdfBaixado, concluidoManual }, temPdf = true) {
    if (concluidoManual) return 100;

    if (!temPdf) {
        return videoAssistido ? 100 : 0;
    }

    let progresso = 0;
    if (videoAssistido) progresso += 100 / 3;
    if (pdfVisualizado) progresso += 100 / 3;
    if (pdfBaixado) progresso += 100 / 3;

    return Math.round(progresso * 100) / 100;
}

function refProgressoAula(turmaId, alunoId, conteudoId) {
    return db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .collection('progressoAulas').doc(conteudoId);
}

export const salvarProgressoAula = async (turmaId, alunoId, conteudoId, dados) => {
    const pdfs = await listarPdfs(turmaId, conteudoId);
    const temPdf = pdfs.length > 0;
    const progresso = calcularProgressoAula(dados, temPdf);

    const payload = {
        videoAssistido:   Boolean(dados.videoAssistido),
        pdfVisualizado:   Boolean(dados.pdfVisualizado),
        pdfBaixado:       Boolean(dados.pdfBaixado),
        concluidoManual:  Boolean(dados.concluidoManual),
        progresso,
        atualizadoEm:     admin.firestore.FieldValue.serverTimestamp(),
    };

    await refProgressoAula(turmaId, alunoId, conteudoId).set(payload, { merge: true });

    const progressoPct = await recalcularProgressoTurma(turmaId, alunoId);

    return { ...payload, progressoPct };
};

export const buscarProgressoAula = async (turmaId, alunoId, conteudoId) => {
    const doc = await refProgressoAula(turmaId, alunoId, conteudoId).get();

    if (!doc.exists) {
        return {
            videoAssistido: false,
            pdfVisualizado: false,
            pdfBaixado: false,
            concluidoManual: false,
            progresso: 0,
        };
    }

    const data = doc.data();
    return {
        videoAssistido:  Boolean(data.videoAssistido),
        pdfVisualizado:  Boolean(data.pdfVisualizado),
        pdfBaixado:      Boolean(data.pdfBaixado),
        concluidoManual: Boolean(data.concluidoManual),
        progresso:       data.progresso ?? calcularProgressoAula(data),
    };
};

export const buscarProgressoTurma = async (turmaId, alunoId) => {
    const snap = await db.collection(COLECAO).doc(turmaId)
        .collection('alunos').doc(alunoId)
        .collection('progressoAulas').get();

    const mapa = {};
    snap.docs.forEach(doc => {
        const data = doc.data();
        mapa[doc.id] = {
            videoAssistido:  Boolean(data.videoAssistido),
            pdfVisualizado:  Boolean(data.pdfVisualizado),
            pdfBaixado:      Boolean(data.pdfBaixado),
            concluidoManual: Boolean(data.concluidoManual),
            progresso:       data.progresso ?? calcularProgressoAula(data),
        };
    });

    return mapa;
};

export const recalcularProgressoTurma = async (turmaId, alunoId) => {
    const conteudos = await listarConteudos(turmaId);
    const totalAulas = conteudos.length;

    if (totalAulas === 0) {
        await atualizarProgressoAluno(turmaId, alunoId, 0);
        return 0;
    }

    const mapa = await buscarProgressoTurma(turmaId, alunoId);

    const soma = conteudos.reduce((acc, c) => {
        const prog = mapa[c.id]?.progresso ?? 0;
        return acc + prog;
    }, 0);

    const progressoPct = Math.min(Math.round((soma / totalAulas) * 100) / 100, 100);

    await atualizarProgressoAluno(turmaId, alunoId, progressoPct);

    return progressoPct;
};

export { calcularProgressoAula };
