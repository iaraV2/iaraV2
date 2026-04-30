// backend/src/routes/usuarioRoutes.js
// ALTERAÇÃO: adicionada rota GET /aprovar-professor (pública — link do e-mail)

import express from 'express';
import {
    cadastrarUsuarioController,
    loginUsuarioController,
    editarUsuarioController,
    deletarUsuarioController,
    esqueciSenhaController,
    resetarSenhaController,
    aprovarProfessorController  // novo
} from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

//! ── Rotas públicas ────────────────────────────────────────────────────────
router.post("/cadastro",      cadastrarUsuarioController)
router.post("/login",         loginUsuarioController)
router.post("/esqueci-senha", esqueciSenhaController)
router.post("/resetar-senha", resetarSenhaController)

//! ── Aprovação de professor (pública — chamada pelo link do e-mail) ────────
//    GET /iara/aprovar-professor?token=xxx&id=yyy
router.get("/aprovar-professor", aprovarProfessorController)

//! ── Rotas privadas ────────────────────────────────────────────────────────
router.put('/editar',    authMiddleware, editarUsuarioController)
router.delete('/deletar', authMiddleware, deletarUsuarioController)

export default router;