// backend/src/services/usuarioService.js
// ALTERAÇÃO: nodemailer substituído pelo Resend (API HTTPS)
// Motivo: DigitalOcean bloqueia portas SMTP (25, 465, 587) em droplets novos.
// O Resend envia e-mails via HTTPS (porta 443) — nunca bloqueada.

import { buscarUsuarioPorEmail, deletarUsuario, atualizarUsuario, buscarUsuarioPorToken, adicionarUsuario,} from "../models/usuarioModel.js";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import 'dotenv/config';
import { Resend } from 'resend';

// Instância única do cliente Resend
// RESEND_API_KEY deve estar no .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Remetente padrão — enquanto não tiver domínio verificado no Resend,
// use 'onboarding@resend.dev'. Após verificar seu domínio, troque para
// algo como 'IAra Suporte <noreply@seudominio.com>'
const REMETENTE = process.env.EMAIL_REMETENTE || 'IAra Suporte <onboarding@resend.dev>';


// ─── Helper: envia e-mail via Resend (HTTPS) ──────────────────────────────────
async function enviarEmail({ para, assunto, html, texto }) {
    const { error } = await resend.emails.send({
        from:    REMETENTE,
        to:      para,
        subject: assunto,
        html:    html,
        text:    texto, // fallback texto puro
    });

    if (error) {
        console.error('[Resend] Erro ao enviar e-mail:', error);
        throw new Error(`Falha ao enviar e-mail: ${error.message}`);
    }
}


//! ─── CADASTRO ─────────────────────────────────────────────────────────────────
const cadastrarUsuarioService = async (dadosUsuario, roleRequisitante = 'publico') => {
    const { nome, email, senha, tema, role } = dadosUsuario;

    if (!nome)                      throw new Error("o nome é obrigatório");
    if (!email)                     throw new Error("o email é obrigatório");
    if (!senha || senha.length < 6) throw new Error("a senha deve ter mais que 6 dígitos");

    let roleDefinida = 'aluno';
    if (roleRequisitante === 'admin') {
        const rolesValidas = ['aluno', 'professor', 'admin'];
        roleDefinida = rolesValidas.includes(role) ? role : 'aluno';
    } else {
        roleDefinida = role === 'professor' ? 'professor_pendente' : 'aluno';
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) throw new Error("Este e-mail já está cadastrado.");

    const salt      = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const tokenAprovacao = roleDefinida === 'professor_pendente'
        ? crypto.randomBytes(32).toString('hex')
        : null;

    const novoUsuario = { nome, email, senha: senhaHash, temaDeInteresse: tema || null, role: roleDefinida, tokenAprovacao, criadoEm: new Date() };
    const idCriado    = await adicionarUsuario(novoUsuario);

    if (roleDefinida === 'professor_pendente') {
        await enviarEmailAprovacaoProfessor({ nome, email, idCriado, tokenAprovacao });
    }

    return {
        id:       idCriado,
        mensagem: roleDefinida === 'professor_pendente'
            ? "Solicitação enviada! Aguarde a aprovação da equipe IAra."
            : "Usuário criado com sucesso!",
        role: roleDefinida,
    };
};


// ─── E-mail de aprovação de professor ─────────────────────────────────────────
async function enviarEmailAprovacaoProfessor({ nome, email, idCriado, tokenAprovacao }) {
    const link = `${process.env.BACKEND_URL || 'http://localhost:3000'}/iara/aprovar-professor?token=${tokenAprovacao}&id=${idCriado}`;

    await enviarEmail({
        para:    process.env.EMAIL_ADMIN || process.env.EMAIL_APP,
        assunto: '🍃 IAra — Nova solicitação de cadastro de Professor',
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border-radius:12px;background:#f9f5ff;border:1px solid #d8b4fe;">
                <h2 style="color:#420583;">Nova solicitação de Professor</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p style="margin-top:24px;">Clique no botão abaixo para <strong>aprovar</strong>:</p>
                <a href="${link}" style="display:inline-block;margin-top:12px;padding:12px 28px;background:#420583;color:white;border-radius:999px;text-decoration:none;font-weight:bold;">✅ Aprovar Professor</a>
            </div>
        `,
    });
}


//! ─── LOGIN ────────────────────────────────────────────────────────────────────
const loginUsuarioService = async (dadosLogin) => {
    const usuarioEncontrado = await buscarUsuarioPorEmail(dadosLogin.email);
    if (!usuarioEncontrado) throw new Error("email ou senha inválidos");

    const comparaSenha = await bcrypt.compare(dadosLogin.senha, usuarioEncontrado.senha);
    if (!comparaSenha) throw new Error("email ou senha inválidos");

    if (usuarioEncontrado.role === 'professor_pendente') {
        throw new Error("Seu cadastro como professor ainda está aguardando aprovação da equipe IAra.");
    }

    const token = jwt.sign(
        { id: usuarioEncontrado.id, email: usuarioEncontrado.email, role: usuarioEncontrado.role || 'aluno' },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    return {
        mensagem: "Login realizado com sucesso",
        token,
        usuario: { id: usuarioEncontrado.id, nome: usuarioEncontrado.nome, email: usuarioEncontrado.email, role: usuarioEncontrado.role || 'aluno' },
    };
};


//! ─── EDITAR USUÁRIO ───────────────────────────────────────────────────────────
const editarUsuarioService = async (idUsuario, novosDados) => {
    const dadosParaAtualizar = {};
    if (novosDados.senha) {
        if (novosDados.senha.length < 6) throw new Error("A nova senha deve ter pelo menos 6 dígitos!");
        const salt = await bcrypt.genSalt(10);
        dadosParaAtualizar.senha = await bcrypt.hash(novosDados.senha, salt);
    }
    if (novosDados.nome)            dadosParaAtualizar.nome            = novosDados.nome;
    if (novosDados.email)           dadosParaAtualizar.email           = novosDados.email;
    if (novosDados.temaDeInteresse) dadosParaAtualizar.temaDeInteresse = novosDados.temaDeInteresse;
    if (!Object.keys(dadosParaAtualizar).length) throw new Error("Nenhum dado válido para atualizar.");
    return await atualizarUsuario(idUsuario, dadosParaAtualizar);
};


//! ─── DELETAR ──────────────────────────────────────────────────────────────────
const deletarUsuarioService = async (idUsuario) => await deletarUsuario(idUsuario);


//! ─── RECUPERAÇÃO DE SENHA ─────────────────────────────────────────────────────
const solicitarRecuperacao = async (email) => {
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) throw new Error('Usuário não encontrado');

    const token     = crypto.randomBytes(4).toString('hex');
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1);

    await atualizarUsuario(usuario.id, {
        resetPasswordToken:   token,
        resetPasswordExpires: expiracao.toISOString(),
    });

    await enviarEmail({
        para:    email,
        assunto: 'IAra - Recuperação de Senha',
        texto:   `Olá! Use o código abaixo para criar uma nova senha:\n\n${token}\n\nEste código expira em 1 hora.`,
        html: `
            <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border-radius:12px;background:#f9f5ff;border:1px solid #d8b4fe;">
                <h2 style="color:#420583;">Recuperação de Senha 🔑</h2>
                <p>Olá! Use o código abaixo para criar uma nova senha:</p>
                <div style="font-size:2rem;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#420583;color:white;border-radius:8px;margin:16px 0;">
                    ${token}
                </div>
                <p style="font-size:12px;color:#888;">Este código expira em 1 hora.</p>
            </div>
        `,
    });
};


//! ─── RESET DE SENHA ───────────────────────────────────────────────────────────
const realizarResetSenha = async (token, novaSenha) => {
    const usuario = await buscarUsuarioPorToken(token);
    if (!usuario) throw new Error('Token inválido ou expirado.');

    const agora    = new Date();
    const dataToken = new Date(usuario.resetPasswordExpires);
    if (agora > dataToken) throw new Error('O código de recuperação expirou.');

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await atualizarUsuario(usuario.id, { senha: senhaHash, resetPasswordToken: null, resetPasswordExpires: null });

    await enviarEmail({
        para:    usuario.email,
        assunto: 'IAra - Senha alterada com sucesso',
        texto:   'Sua senha foi alterada com sucesso. Se não foi você, entre em contato com o suporte.',
        html: `
            <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border-radius:12px;background:#f9f5ff;border:1px solid #d8b4fe;">
                <h2 style="color:#420583;">Senha alterada ✅</h2>
                <p>Olá! Sua senha na IAra foi alterada com sucesso.</p>
                <p style="color:#cc0000;font-size:13px;">Se não foi você quem fez isso, entre em contato com o suporte imediatamente.</p>
            </div>
        `,
    });
};


export {
    cadastrarUsuarioService,
    loginUsuarioService,
    editarUsuarioService,
    deletarUsuarioService,
    solicitarRecuperacao,
    realizarResetSenha,
};