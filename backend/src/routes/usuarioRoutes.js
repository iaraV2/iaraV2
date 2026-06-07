import express from 'express';
import { cadastrarUsuarioController, loginUsuarioController } from '../controllers/usuarioController.js';
import { deletarUsuarioController, editarUsuarioController } from '../controllers/usuarioController.js';
import { esqueciSenhaController, resetarSenhaController } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

//! Rotas públicas
router.post("/cadastro", cadastrarUsuarioController);
router.post("/login", loginUsuarioController);

//! Rotas para recuperação de senha (públicas)
router.post("/esqueci-senha", esqueciSenhaController);
router.post("/resetar-senha", resetarSenhaController);

//! Rotas privadas
router.put('/editar', authMiddleware, editarUsuarioController);
router.delete('/deletar', authMiddleware, deletarUsuarioController);

//! Remove uma turma deletada do histórico do aluno
router.delete('/minhas-turmas/:turmaId', authMiddleware, async (req, res) => {
    try {
        await db.collection('usuarios').doc(req.userId)
            .collection('turmasMatriculadas').doc(req.params.turmaId).delete();
        res.status(200).json({ mensagem: 'Turma removida com sucesso.' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

export default router;