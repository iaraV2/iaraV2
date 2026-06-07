// src/controllers/turmaController.js

import {
    criarTurmaService, editarTurmaService, listarTurmasProfessorService, deletarTurmaService,
    entrarNaTurmaService, listarTurmasAlunoService, buscarTurmaPorCodigoPublicoService,
    buscarTurmasPorTituloPublicoService, listarTodasTurmasPublicasService,
    atualizarProgressoService, liberarAlunoService, listarAlunosService, removerAlunoService,
    adicionarConteudoService, listarConteudosService, editarConteudoService, deletarConteudoService,
    uploadPdfService, listarPdfsService, baixarPdfService, deletarPdfService,
} from '../services/turmaService.js';


// ─── TURMAS ───────────────────────────────────────────────────────────────────

//! Professor cria uma nova turma
export const criarTurmaController = async (req, res) => {
    try {
        const resultado = await criarTurmaService(req.userId, req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor edita turma (nome, descrição ou código)
export const editarTurmaController = async (req, res) => {
    try {
        const resultado = await editarTurmaService(req.userId, req.params.turmaId, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor lista suas turmas
export const listarTurmasProfessorController = async (req, res) => {
    try {
        const turmas = await listarTurmasProfessorService(req.userId);
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

//! Professor deleta uma turma
export const deletarTurmaController = async (req, res) => {
    try {
        const resultado = await deletarTurmaService(req.userId, req.params.turmaId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};


// ─── ENTRADA DO ALUNO ─────────────────────────────────────────────────────────

//! Aluno entra na turma pelo código de convite
export const entrarNaTurmaController = async (req, res) => {
    try {
        const { codigo } = req.body;
        if (!codigo) return res.status(400).json({ erro: 'O código da turma é obrigatório.' });
        const resultado = await entrarNaTurmaService(req.userId, codigo);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Aluno lista suas turmas
export const listarTurmasAlunoController = async (req, res) => {
    try {
        const turmas = await listarTurmasAlunoService(req.userId);
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

//! Busca turma por código (pública para alunos)
export const buscarTurmaPorCodigoController = async (req, res) => {
    try {
        const { codigo } = req.params;
        if (!codigo) return res.status(400).json({ erro: 'Código é obrigatório.' });
        const turma = await buscarTurmaPorCodigoPublicoService(codigo.toUpperCase());
        res.status(200).json(turma);
    } catch (error) {
        res.status(404).json({ erro: error.message });
    }
};

//! Busca turmas por título (pública para alunos)
export const buscarTurmasPorTituloController = async (req, res) => {
    try {
        const { titulo } = req.params;
        if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório.' });
        const turmas = await buscarTurmasPorTituloPublicoService(titulo);
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

//! Lista todas as turmas públicas (ativas) para alunos
export const listarTodasTurmasPublicasController = async (req, res) => {
    try {
        const turmas = await listarTodasTurmasPublicasService();
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};


// ─── PROGRESSO E ALUNOS ───────────────────────────────────────────────────────

//! Atualiza o progresso do aluno em uma turma
export const atualizarProgressoController = async (req, res) => {
    try {
        const { turmaId } = req.params;

        // Converte para número — body JSON pode trazer string ou undefined
        const progressoPct = Number(req.body.progressoPct);

        // Rejeita aqui mesmo se vier undefined, null, texto, etc.
        if (isNaN(progressoPct)) {
            return res.status(400).json({ erro: 'progressoPct deve ser um número entre 0 e 100.' });
        }

        const resultado = await atualizarProgressoService(turmaId, req.userId, progressoPct);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor libera aluno para próxima turma
export const liberarAlunoController = async (req, res) => {
    try {
        const { turmaId, alunoId } = req.params;
        const resultado = await liberarAlunoService(req.userId, turmaId, alunoId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor lista alunos da turma
export const listarAlunosController = async (req, res) => {
    try {
        const alunos = await listarAlunosService(req.userId, req.params.turmaId);
        res.status(200).json(alunos);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor remove aluno da turma
export const removerAlunoController = async (req, res) => {
    try {
        const { turmaId, alunoId } = req.params;
        const resultado = await removerAlunoService(req.userId, turmaId, alunoId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};


// ─── CONTEÚDOS ────────────────────────────────────────────────────────────────

//! Professor adiciona conteúdo
export const adicionarConteudoController = async (req, res) => {
    try {
        const resultado = await adicionarConteudoService(req.userId, req.params.turmaId, req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Lista conteúdos de uma turma (aluno ou professor)
export const listarConteudosController = async (req, res) => {
    try {
        const conteudos = await listarConteudosService(req.params.turmaId, req.userId, req.userRole);
        res.status(200).json(conteudos);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor edita conteúdo
export const editarConteudoController = async (req, res) => {
    try {
        const { turmaId, conteudoId } = req.params;
        const resultado = await editarConteudoService(req.userId, turmaId, conteudoId, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Professor deleta conteúdo
export const deletarConteudoController = async (req, res) => {
    try {
        const { turmaId, conteudoId } = req.params;
        const resultado = await deletarConteudoService(req.userId, turmaId, conteudoId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

// ─── PDFs ─────────────────────────────────────────────────────────────────────

export const uploadPdfController = async (req, res) => {
    try {
        const { turmaId, conteudoId } = req.params;
        if (!turmaId || !conteudoId) {
            return res.status(400).json({ erro: 'turmaId e conteudoId são obrigatórios.' });
        }
        if (!req.file) {
            return res.status(400).json({ erro: 'Nenhum arquivo foi anexado. Use o campo "pdf".' });
        }
        const resultado = await uploadPdfService(req.userId, turmaId, conteudoId, req.file);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

export const listarPdfsController = async (req, res) => {
    try {
        const { turmaId, conteudoId } = req.params;
        const pdfs = await listarPdfsService(turmaId, conteudoId);
        res.status(200).json(pdfs);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

export const baixarPdfController = async (req, res) => {
    try {
        const { turmaId, conteudoId, pdfId } = req.params;
        const pdf = await baixarPdfService(turmaId, conteudoId, pdfId);
        if (!pdf) return res.status(404).json({ erro: 'PDF não encontrado.' });
        const buffer = Buffer.from(pdf.base64, 'base64');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdf.nome}"`);
        res.send(buffer);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

export const deletarPdfController = async (req, res) => {
    try {
        const { turmaId, conteudoId, pdfId } = req.params;
        const resultado = await deletarPdfService(req.userId, turmaId, conteudoId, pdfId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};