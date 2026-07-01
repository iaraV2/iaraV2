import {
    salvarProgressoAulaService,
    buscarProgressoAulaService,
    buscarProgressoTurmaService,
} from '../services/progressoService.js';

export const salvarProgressoController = async (req, res) => {
    try {
        const { turmaId, conteudoId, videoAssistido, pdfVisualizado, pdfBaixado, concluidoManual } = req.body;

        if (!turmaId || !conteudoId) {
            return res.status(400).json({ erro: 'turmaId e conteudoId são obrigatórios.' });
        }

        const alunoId = (req.userRole === 'professor' && req.body.usuarioId)
            ? req.body.usuarioId
            : req.userId;

        const resultado = await salvarProgressoAulaService(turmaId, alunoId, conteudoId, {
            videoAssistido,
            pdfVisualizado,
            pdfBaixado,
            concluidoManual,
        });

        return res.status(200).json(resultado);
    } catch (error) {
        console.error('[Progresso] Erro ao salvar:', error);
        return res.status(400).json({ erro: error.message || 'Erro ao salvar progresso.' });
    }
};

export const buscarProgressoAulaController = async (req, res) => {
    try {
        const { turmaId, conteudoId, usuarioId } = req.params;
        const alunoId = (req.userRole === 'professor' && usuarioId) ? usuarioId : req.userId;

        const resultado = await buscarProgressoAulaService(turmaId, alunoId, conteudoId);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('[Progresso] Erro ao buscar aula:', error);
        return res.status(400).json({ erro: error.message || 'Erro ao buscar progresso.' });
    }
};

export const buscarProgressoTurmaController = async (req, res) => {
    try {
        const { turmaId, usuarioId } = req.params;
        const alunoId = (req.userRole === 'professor' && usuarioId) ? usuarioId : req.userId;

        const resultado = await buscarProgressoTurmaService(turmaId, alunoId);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('[Progresso] Erro ao buscar turma:', error);
        return res.status(400).json({ erro: error.message || 'Erro ao buscar progresso da turma.' });
    }
};