import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

import { 
    buscarHistoricoController, 
    enviarMensagemController, 
    treinarIAController,
    statusMonitorController, 
    verificarAgora           
} from '../controllers/chatController.js';

const router = express.Router();

// ─── Rotas do Aluno ──────────────────────────────────────────────────────────
router.post('/enviar', authMiddleware, enviarMensagemController);
router.get("/historico", authMiddleware, buscarHistoricoController);

// ─── Rotas Administrativas ───────────────────────────────────────────────────
// Protegendo com authMiddleware (Se tiver o roleMiddleware, adicione logo depois dele)
router.post('/treinar', authMiddleware, treinarIAController);
router.get('/monitor/status', authMiddleware, statusMonitorController);
router.post('/monitor/verificar', authMiddleware, verificarAgora);

export default router;