import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { turmaMiddleware } from '../middlewares/turmaMiddleware.js';

import { 
    buscarHistoricoController, 
    enviarMensagemController, 
    treinarIAController,
    statusMonitorController, 
    verificarAgora           
} from '../controllers/chatController.js';

const router = express.Router();

// ─── Rotas do Aluno ──────────────────────────────────────────────────────────
router.post('/enviar', authMiddleware,turmaMiddleware, enviarMensagemController);
router.get("/historico", authMiddleware,turmaMiddleware, buscarHistoricoController);

// ─── Rotas Administrativas ───────────────────────────────────────────────────
// Protegendo com authMiddleware (Se tiver o roleMiddleware, adicione logo depois dele)
router.post('/treinar', authMiddleware, treinarIAController);
router.get('/monitor/status', authMiddleware, statusMonitorController);
router.post('/monitor/verificar', authMiddleware, verificarAgora);

export default router;