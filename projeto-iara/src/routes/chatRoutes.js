import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { buscarHistoricoController, enviarMensagemController } from '../controllers/chatController.js';

const router = express.Router()

router.post('/enviar', authMiddleware, enviarMensagemController);
router.get("/historico", authMiddleware, buscarHistoricoController)

export default router