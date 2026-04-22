import express from 'express';
import { cadastrarUsuarioController, loginUsuarioController } from '../controllers/usuarioController.js';
import { deletarUsuarioController, editarUsuarioController } from '../controllers/usuarioController.js';
import { esqueciSenhaController, resetarSenhaController } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

//!rotas publicas
router.post("/cadastro", cadastrarUsuarioController); //? criação de um endpoint para a funcionalidade de cadastro 
router.post("/login", loginUsuarioController)

//!rotas para recuperação de senha(publicas)
router.post("/esqueci-senha", esqueciSenhaController);
router.post("/resetar-senha", resetarSenhaController);

//!rotas privadas
router.put('/editar', authMiddleware, editarUsuarioController);
router.delete('/deletar', authMiddleware, deletarUsuarioController);


export default router;