import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

import {
    listarSolicitacoesController,
    aprovarProfessorController,
    rejeitarProfessorController,
    listarTodosUsuariosController,
    deletarUsuarioAdminController,
} from '../controllers/adminController.js';

const router = express.Router();

// Todas as rotas exigem login + role de admin
router.use(authMiddleware, roleMiddleware('admin'));

// Solicitações de professores
router.get(    '/solicitacoes',           listarSolicitacoesController);
router.patch(  '/aprovar/:usuarioId',     aprovarProfessorController);
router.delete( '/rejeitar/:usuarioId',    rejeitarProfessorController);

// Gestão de todos os usuários
router.get(    '/usuarios',               listarTodosUsuariosController);
router.delete( '/usuarios/:usuarioId',    deletarUsuarioAdminController);

export default router;