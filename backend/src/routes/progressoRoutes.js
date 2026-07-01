import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    salvarProgressoController,
    buscarProgressoAulaController,
    buscarProgressoTurmaController,
} from '../controllers/progressoController.js';

const router = express.Router();

router.post('/', authMiddleware, salvarProgressoController);
router.get('/turma/:turmaId/:usuarioId', authMiddleware, buscarProgressoTurmaController);
router.get('/:turmaId/:conteudoId/:usuarioId', authMiddleware, buscarProgressoAulaController);

export default router;
