// backend/src/services/adminService.js
// Toda a lógica de negócio exclusiva do admin (e parte do professor)

import {
    listarTodosUsuarios,
    listarUsuariosPorRole,
    buscarUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
} from '../models/usuarioModel.js'
import { cadastrarUsuarioService } from './usuarioService.js'
import bcrypt from 'bcryptjs'


//! Admin cria um novo usuário com role definida (aluno ou professor)
export const criarUsuarioComoAdmin = async (dadosUsuario) => {
    //? Passa 'admin' como roleRequisitante para o service liberar a criação com role definida
    return await cadastrarUsuarioService(dadosUsuario, 'admin')
}


//! Listar todos os usuários (painel admin)
export const listarTodosService = async () => {
    return await listarTodosUsuarios()
}


//! Listar por role — admin vê só professores, admin vê só alunos etc.
export const listarPorRoleService = async (role) => {
    const rolesValidas = ['aluno', 'professor', 'admin']
    if (!rolesValidas.includes(role)) {
        throw new Error(`Role inválida. Use: ${rolesValidas.join(', ')}`)
    }
    return await listarUsuariosPorRole(role)
}


//! Admin edita qualquer usuário (inclusive trocar a role dele)
export const editarUsuarioComoAdmin = async (idAlvo, novosDados) => {

    //? Admin pode trocar a role — verificamos se é válida
    const dadosParaAtualizar = {}

    if (novosDados.nome)  dadosParaAtualizar.nome  = novosDados.nome
    if (novosDados.email) dadosParaAtualizar.email = novosDados.email

    if (novosDados.role) {
        const rolesValidas = ['aluno', 'professor', 'admin']
        if (!rolesValidas.includes(novosDados.role)) {
            throw new Error(`Role inválida. Use: ${rolesValidas.join(', ')}`)
        }
        dadosParaAtualizar.role = novosDados.role
    }

    if (novosDados.temaDeInteresse) {
        dadosParaAtualizar.temaDeInteresse = novosDados.temaDeInteresse
    }

    if (novosDados.senha) {
        if (novosDados.senha.length < 6) throw new Error('A nova senha deve ter pelo menos 6 dígitos!')
        const salt = await bcrypt.genSalt(10)
        dadosParaAtualizar.senha = await bcrypt.hash(novosDados.senha, salt)
    }

    if (Object.keys(dadosParaAtualizar).length === 0) {
        throw new Error('Nenhum dado válido para atualizar.')
    }

    return await atualizarUsuario(idAlvo, dadosParaAtualizar)
}


//! Admin deleta qualquer usuário pelo ID
export const deletarUsuarioComoAdmin = async (idAlvo) => {
    //? Garante que o usuário existe antes de tentar deletar
    const usuario = await buscarUsuarioPorId(idAlvo)
    if (!usuario) throw new Error('Usuário não encontrado.')

    return await deletarUsuario(idAlvo)
}


//! Buscar um único usuário por ID (para visualização no painel)
export const buscarUsuarioService = async (idAlvo) => {
    const usuario = await buscarUsuarioPorId(idAlvo)
    if (!usuario) throw new Error('Usuário não encontrado.')

    //? Nunca retornar a senha
    delete usuario.senha
    delete usuario.resetPasswordToken
    delete usuario.resetPasswordExpires

    return usuario
}