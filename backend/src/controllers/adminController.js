// backend/src/controllers/adminController.js

import {
    criarUsuarioComoAdmin,
    listarTodosService,
    listarPorRoleService,
    editarUsuarioComoAdmin,
    deletarUsuarioComoAdmin,
    buscarUsuarioService
} from '../services/adminService.js'


//! Admin cria aluno ou professor
export const criarUsuarioAdminController = async (req, res) => {
    try {
        const dados = req.body
        const resultado = await criarUsuarioComoAdmin(dados)
        res.status(201).json(resultado)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}


//! Listar todos os usuários
export const listarTodosController = async (req, res) => {
    try {
        const usuarios = await listarTodosService()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}


//! Listar por role — GET /admin/usuarios?role=professor
export const listarPorRoleController = async (req, res) => {
    try {
        const { role } = req.query //? ?role=aluno  ou  ?role=professor
        if (!role) {
            return res.status(400).json({ erro: 'Informe a role na query: ?role=aluno' })
        }
        const usuarios = await listarPorRoleService(role)
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}


//! Buscar um usuário específico — GET /admin/usuarios/:id
export const buscarUsuarioController = async (req, res) => {
    try {
        const { id } = req.params
        const usuario = await buscarUsuarioService(id)
        res.status(200).json(usuario)
    } catch (error) {
        res.status(404).json({ erro: error.message })
    }
}


//! Admin edita qualquer usuário — PUT /admin/usuarios/:id
export const editarUsuarioAdminController = async (req, res) => {
    try {
        const { id }      = req.params
        const novosDados  = req.body
        const resultado   = await editarUsuarioComoAdmin(id, novosDados)
        res.status(200).json(resultado)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}


//! Admin deleta qualquer usuário — DELETE /admin/usuarios/:id
export const deletarUsuarioAdminController = async (req, res) => {
    try {
        const { id }    = req.params
        const resultado = await deletarUsuarioComoAdmin(id)
        res.status(200).json(resultado)
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}