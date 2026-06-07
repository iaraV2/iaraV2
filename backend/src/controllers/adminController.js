// src/controllers/adminController.js

import {
    listarSolicitacoesService,
    aprovarProfessorService,
    rejeitarProfessorService,
    listarTodosUsuariosService,
    deletarUsuarioAdminService,
} from '../services/adminService.js';


//! Lista todos os professores com status "professor_pendente"
export const listarSolicitacoesController = async (req, res) => {
    try {
        const solicitacoes = await listarSolicitacoesService();
        res.status(200).json(solicitacoes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

//! Aprova um professor (muda role para "professor")
export const aprovarProfessorController = async (req, res) => {
    try {
        const resultado = await aprovarProfessorService(req.params.usuarioId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Rejeita e deleta o cadastro de professor pendente
export const rejeitarProfessorController = async (req, res) => {
    try {
        const resultado = await rejeitarProfessorService(req.params.usuarioId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};

//! Lista todos os usuários (alunos, professores, pendentes)
export const listarTodosUsuariosController = async (req, res) => {
    try {
        const usuarios = await listarTodosUsuariosService();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

//! Admin força a deleção de qualquer usuário
export const deletarUsuarioAdminController = async (req, res) => {
    try {
        const resultado = await deletarUsuarioAdminService(req.params.usuarioId);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
};