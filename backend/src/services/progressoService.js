import {
    salvarProgressoAula,
    buscarProgressoAula,
    buscarProgressoTurma,
    recalcularProgressoTurma,
} from '../models/progressoModel.js';
import { buscarAlunoNaTurma, adicionarAlunoNaTurma } from '../models/turmaModel.js';

export const salvarProgressoAulaService = async (turmaId, alunoId, conteudoId, dados) => {
    const vinculo = await buscarAlunoNaTurma(turmaId, alunoId);
    if (!vinculo) {
        await adicionarAlunoNaTurma(turmaId, alunoId);
    }

    return salvarProgressoAula(turmaId, alunoId, conteudoId, dados);
};

export const buscarProgressoAulaService = async (turmaId, alunoId, conteudoId) => {
    return buscarProgressoAula(turmaId, alunoId, conteudoId);
};

export const buscarProgressoTurmaService = async (turmaId, alunoId) => {
    const vinculo = await buscarAlunoNaTurma(turmaId, alunoId);
    if (!vinculo) {
        await adicionarAlunoNaTurma(turmaId, alunoId);
    }

    const progressoPct = await recalcularProgressoTurma(turmaId, alunoId);
    const mapa = await buscarProgressoTurma(turmaId, alunoId);

    return { progressoPorAula: mapa, progressoPct };
};
