

import express from 'express'
import { authMiddleware }  from '../middlewares/authMiddleware.js'
import { roleMiddleware }  from '../middlewares/roleMiddleware.js'
import {
    criarUsuarioAdminController,
    listarTodosController,
    listarPorRoleController,
    buscarUsuarioController,
    editarUsuarioAdminController,
    deletarUsuarioAdminController
} from '../controllers/adminController.js'

const router = express.Router()

//? Atalhos de middleware para não repetir em cada rota
const apenasAdmin     = [authMiddleware, roleMiddleware(['admin'])]
const adminOuProfessor = [authMiddleware, roleMiddleware(['admin', 'professor'])]


// ── Rotas exclusivas do ADMIN ─────────────────────────────────────────────

//? Admin cria aluno ou professor com role definida
router.post('/usuarios',       ...apenasAdmin, criarUsuarioAdminController)

//? Admin lista TODOS os usuários (sem filtro)
router.get('/usuarios',        ...apenasAdmin, listarTodosController)

//? Admin (e professor) filtra por role — GET /admin/usuarios/filtrar?role=aluno
router.get('/usuarios/filtrar', ...adminOuProfessor, listarPorRoleController)

//? Admin (e professor) busca um usuário específico
router.get('/usuarios/:id',    ...adminOuProfessor, buscarUsuarioController)

//? Admin edita qualquer usuário (pode trocar role, nome, email, senha)
router.put('/usuarios/:id',    ...apenasAdmin, editarUsuarioAdminController)

//? Admin deleta qualquer usuário
router.delete('/usuarios/:id', ...apenasAdmin, deletarUsuarioAdminController)


export default router