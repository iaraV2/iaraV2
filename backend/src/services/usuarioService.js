// backend/src/services/usuarioService.js
// ALTERAÇÕES NESTA VERSÃO:
//   - cadastro com role 'professor' cria conta como 'professor_pendente'
//   - dispara email ao admin para aprovar o cadastro
//   - nova função: aprovarProfessorService → muda role para 'professor' e avisa o professor
//   - login bloqueia 'professor_pendente' com mensagem clara

import { buscarUsuarioPorEmail, deletarUsuario, atualizarUsuario, buscarUsuarioPorToken, adicionarUsuario, buscarUsuarioPorId } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


// ─── Helper: cria o transportador de e-mail (evita repetição) ─────────────
function criarTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_SENHA
        }
    })
}


//! ─── CADASTRO ─────────────────────────────────────────────────────────────
const cadastrarUsuarioService = async (dadosUsuario, roleRequisitante = 'publico') => {
    const { nome, email, senha, tema, role } = dadosUsuario

    if (!nome)                      throw new Error("o nome é obrigatório")
    if (!email)                     throw new Error("o email é obrigatório")
    if (!senha || senha.length < 6) throw new Error("a senha deve ter mais que 6 dígitos")

    // ── Definição segura da role ───────────────────────────────────────────
    //
    // FLUXO PÚBLICO (roleRequisitante = 'publico'):
    //   - role 'aluno'     → cria como 'aluno'              (entra imediatamente)
    //   - role 'professor' → cria como 'professor_pendente' (aguarda aprovação admin)
    //   - qualquer outra   → força 'aluno'                  (proteção contra elevação)
    //
    // FLUXO ADMIN (roleRequisitante = 'admin'):
    //   - pode criar diretamente com qualquer role, sem passar por pendente
    //
    let roleDefinida = 'aluno'

    if (roleRequisitante === 'admin') {
        const rolesValidas = ['aluno', 'professor', 'admin']
        roleDefinida = rolesValidas.includes(role) ? role : 'aluno'
    } else {
        roleDefinida = role === 'professor' ? 'professor_pendente' : 'aluno'
    }

    // ── Verifica se email já existe ────────────────────────────────────────
    const usuarioExistente = await buscarUsuarioPorEmail(email)
    if (usuarioExistente) throw new Error("Este e-mail já está cadastrado.")

    // ── Criptografa a senha ────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha, salt)

    // ── Token de aprovação: gerado só para professor_pendente ─────────────
    //    É um token aleatório de 32 bytes que vai no link do e-mail do admin.
    //    Funciona como uma "chave única" — o admin só aprova quem tem esse token.
    const tokenAprovacao = roleDefinida === 'professor_pendente'
        ? crypto.randomBytes(32).toString('hex')
        : null

    const novoUsuario = {
        nome,
        email,
        senha:           senhaHash,
        temaDeInteresse: tema || null,
        role:            roleDefinida,
        tokenAprovacao,
        criadoEm:        new Date()
    }

    const idCriado = await adicionarUsuario(novoUsuario)

    // ── Dispara e-mail ao admin se for professor pendente ─────────────────
    if (roleDefinida === 'professor_pendente') {
        await enviarEmailAprovacaoProfessor({ nome, email, idCriado, tokenAprovacao })
    }

    return {
        id:       idCriado,
        mensagem: roleDefinida === 'professor_pendente'
            ? "Solicitação enviada! Aguarde a aprovação da equipe IAra. Você receberá um e-mail quando for aprovado."
            : "Usuário criado com sucesso!",
        role: roleDefinida
    }
}


// ─── Envia e-mail para o ADMIN aprovar o cadastro de professor ─────────────
async function enviarEmailAprovacaoProfessor({ nome, email, idCriado, tokenAprovacao }) {
    const transporter = criarTransporter()

    // Link que o admin clica — endpoint GET no backend que processa a aprovação
    const linkAprovacao = `${process.env.BACKEND_URL || 'http://localhost:3000'}/iara/aprovar-professor?token=${tokenAprovacao}&id=${idCriado}`

    await transporter.sendMail({
        from:    `IAra Suporte <${process.env.EMAIL_APP}>`,
        to:      process.env.EMAIL_ADMIN || process.env.EMAIL_APP,
        subject: '🍃 IAra — Nova solicitação de cadastro de Professor',
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px;
                        border-radius: 12px; background: #f9f5ff; border: 1px solid #d8b4fe;">
                <h2 style="color: #420583;">Nova solicitação de Professor</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p style="margin-top: 24px;">Clique no botão abaixo para <strong>aprovar</strong> este cadastro:</p>
                <a href="${linkAprovacao}"
                   style="display:inline-block; margin-top:12px; padding:12px 28px;
                          background:#420583; color:white; border-radius:999px;
                          text-decoration:none; font-weight:bold;">
                    ✅ Aprovar Professor
                </a>
                <p style="margin-top:24px; font-size:12px; color:#888;">
                    Se não reconhece esta solicitação, ignore este e-mail.
                </p>
            </div>
        `
    })
}


//! ─── APROVAR PROFESSOR ────────────────────────────────────────────────────
// Chamado quando o admin clica no link do e-mail.
// Valida token + id, promove a role e confirma o professor por e-mail.
const aprovarProfessorService = async (token, idUsuario) => {
    const usuario = await buscarUsuarioPorId(idUsuario)

    if (!usuario)
        throw new Error('Usuário não encontrado.')

    if (usuario.tokenAprovacao !== token)
        throw new Error('Link de aprovação inválido ou já utilizado.')

    if (usuario.role !== 'professor_pendente')
        throw new Error('Este cadastro já foi processado.')

    // Promove para professor e apaga o token (token de uso único)
    await atualizarUsuario(idUsuario, {
        role:           'professor',
        tokenAprovacao: null
    })

    // Avisa o professor que foi aprovado
    await enviarEmailAprovacaoConfirmada(usuario)

    return { mensagem: `Professor ${usuario.nome} aprovado com sucesso!` }
}


//? ─── Avisa o professor que foi aprovado ───────────────────────────────────
async function enviarEmailAprovacaoConfirmada(usuario) {
    const transporter = criarTransporter()

    await transporter.sendMail({
        from:    `IAra Suporte <${process.env.EMAIL_APP}>`,
        to:      usuario.email,
        subject: '🎉 IAra — Seu cadastro como Professor foi aprovado!',
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px;
                        border-radius: 12px; background: #f9f5ff; border: 1px solid #d8b4fe;">
                <h2 style="color: #420583;">Olá, ${usuario.nome}! 🌿</h2>
                <p>Sua solicitação de cadastro como <strong>Professor(a)</strong> foi <strong>aprovada</strong>!</p>
                <p>Agora você já pode entrar na plataforma e começar a publicar conteúdos para sua turma.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
                   style="display:inline-block; margin-top:16px; padding:12px 28px;
                          background:#420583; color:white; border-radius:999px;
                          text-decoration:none; font-weight:bold;">
                    Acessar a IAra
                </a>
                <p style="margin-top:24px; font-size:13px; color:#555;">
                    Bem-vindo(a) à comunidade IAra! 💜
                </p>
            </div>
        `
    })
}


//! ─── LOGIN ────────────────────────────────────────────────────────────────
const loginUsuarioService = async (dadosLogin) => {
    const usuarioEncontrado = await buscarUsuarioPorEmail(dadosLogin.email)

    if (!usuarioEncontrado) throw new Error("email ou senha inválidos")

    const comparaSenha = await bcrypt.compare(dadosLogin.senha, usuarioEncontrado.senha)
    if (!comparaSenha) throw new Error("email ou senha inválidos")

    // Professor pendente tenta logar → mensagem clara, sem token
    if (usuarioEncontrado.role === 'professor_pendente') {
        throw new Error("Seu cadastro como professor ainda está aguardando aprovação da equipe IAra. Você receberá um e-mail quando for aprovado.")
    }

    const JWT_SECRET = process.env.JWT_SECRET

    const token = jwt.sign(
        {
            id:    usuarioEncontrado.id,
            email: usuarioEncontrado.email,
            role:  usuarioEncontrado.role || 'aluno'
        },
        JWT_SECRET,
        { expiresIn: "12h" }
    )

    return {
        mensagem: "Login realizado com sucesso",
        token,
        usuario: {
            id:    usuarioEncontrado.id,
            nome:  usuarioEncontrado.nome,
            email: usuarioEncontrado.email,
            role:  usuarioEncontrado.role || 'aluno'
        }
    }
}


//! ─── EDITAR USUÁRIO (sem alteração) ──────────────────────────────────────
const editarUsuarioService = async (idUsuario, novosDados) => {
    const dadosParaAtualizar = {}

    if (novosDados.senha) {
        if (novosDados.senha.length < 6) throw new Error("A nova senha deve ter pelo menos 6 dígitos!")
        const salt = await bcrypt.genSalt(10)
        dadosParaAtualizar.senha = await bcrypt.hash(novosDados.senha, salt)
    }

    if (novosDados.nome)            dadosParaAtualizar.nome            = novosDados.nome
    if (novosDados.email)           dadosParaAtualizar.email           = novosDados.email
    if (novosDados.temaDeInteresse) dadosParaAtualizar.temaDeInteresse = novosDados.temaDeInteresse

    if (Object.keys(dadosParaAtualizar).length === 0) throw new Error("Nenhum dado válido para atualizar.")

    return await atualizarUsuario(idUsuario, dadosParaAtualizar)
}


//! ─── DELETAR (sem alteração) ─────────────────────────────────────────────
const deletarUsuarioService = async (idUsuario) => {
    return await deletarUsuario(idUsuario)
}


//! ─── RECUPERAÇÃO DE SENHA (sem alteração) ────────────────────────────────
const solicitarRecuperacao = async (email) => {
    const usuario = await buscarUsuarioPorEmail(email)
    if (!usuario) throw new Error('Usuário não encontrado')

    const token = crypto.randomBytes(4).toString('hex')
    const expiracao = new Date()
    expiracao.setHours(expiracao.getHours() + 1)

    await atualizarUsuario(usuario.id, {
        resetPasswordToken:   token,
        resetPasswordExpires: expiracao.toISOString()
    })

    const transporter = criarTransporter()
    return await transporter.sendMail({
        from:    `IAra Suporte <${process.env.EMAIL_APP}>`,
        to:      email,
        subject: 'IAra - Recuperação de Senha',
        text:    `Olá! Use o código abaixo para criar uma nova senha:\n\n${token}\n\nEste código expira em 1 hora.`
    })
}


//! ─── RESET DE SENHA (sem alteração) ─────────────────────────────────────
const realizarResetSenha = async (token, novaSenha) => {
    const usuario = await buscarUsuarioPorToken(token)
    if (!usuario) throw new Error('Token inválido ou expirado.')

    const agora     = new Date()
    const dataToken = new Date(usuario.resetPasswordExpires)
    if (agora > dataToken) throw new Error('O código de recuperação expirou.')

    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(novaSenha, salt)

    await atualizarUsuario(usuario.id, {
        senha:                senhaHash,
        resetPasswordToken:   null,
        resetPasswordExpires: null
    })

    const transporter = criarTransporter()
    return await transporter.sendMail({
        from:    `IAra Suporte <${process.env.EMAIL_APP}>`,
        to:      usuario.email,
        subject: 'IAra - Senha alterada com sucesso',
        text:    `Olá!\n\nSua senha na IAra foi alterada com sucesso.\n\nSe não foi você, entre em contato com o suporte imediatamente.`
    })
}


export {
    cadastrarUsuarioService,
    aprovarProfessorService,
    loginUsuarioService,
    editarUsuarioService,
    deletarUsuarioService,
    solicitarRecuperacao,
    realizarResetSenha
}