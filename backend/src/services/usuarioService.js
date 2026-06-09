//! aqui onde o cerebro de cada operação funciona os services 
//! nossos services de usuarios deve poder cadastrar, logar, deletar a propria conta, conversar com a IA

import { buscarUsuarioPorEmail, deletarUsuario, atualizarUsuario, buscarUsuarioPorToken} from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {adicionarUsuario} from "../models/usuarioModel.js"
import 'dotenv/config';
import crypto from 'crypto';
import { Resend } from 'resend'; // 🔥 Substituído Nodemailer pelo Resend

// Inicialização do Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const REMETENTE = process.env.EMAIL_REMETENTE || 'IAra Suporte <onboarding@resend.dev>';

//!CADASTRO
const cadastrarUsuarioService = async (dadosUsuario, roleRequisitante = 'publico') => {
    const { nome, email, senha, tema, role } = dadosUsuario;

    if (!nome)                      throw new Error("o nome é obrigatório");
    if (!email)                     throw new Error("o email é obrigatório");
    if (!senha || senha.length < 6) throw new Error("a senha deve ter mais que 6 dígitos");

    // Define a role correta
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

    const novoUsuario = {
        nome,
        email,
        senha:           senhaHash,
        temaDeInteresse: tema || 'Padrão',
        role:            roleDefinida,
        criadoEm:        new Date(),
    };

    const idCriado = await adicionarUsuario(novoUsuario);

    return {
        id:       idCriado,
        mensagem: roleDefinida === 'professor_pendente'
            ? "Solicitação enviada! Aguarde a aprovação da equipe IAra."
            : "Usuário criado com sucesso!",
        role: roleDefinida,
    };
};

//!LOGIN
const loginUsuarioService = async (dadosLogin) => {
        console.log('🔍 Dados recebidos no login:', dadosLogin);
        
        const usuarioEncontrado = await buscarUsuarioPorEmail(dadosLogin.email)
        console.log('👤 Usuário encontrado:', usuarioEncontrado ? 'SIM' : 'NÃO');
        console.log('📧 Email buscado:', dadosLogin.email);
  
        
        if(!usuarioEncontrado){
            console.log('❌ Usuário não encontrado para email:', dadosLogin.email);
            throw new Error("email ou senha invalida")
        }

        const comparaSenha = await bcrypt.compare(dadosLogin.senha, usuarioEncontrado.senha)

        if(!comparaSenha){
            throw new Error("email ou senha invalidos")
        }
        
        if (usuarioEncontrado.role === 'professor_pendente') {
            throw new Error("Seu cadastro de professor está em análise. Aguarde a aprovação do administrador.");
        }

        const JWT_SECRET = process.env.JWT_SECRET 
        
        // Garante que role sempre existe (fallback para 'aluno' se não tiver no Firestore)
        const roleDoUsuario = usuarioEncontrado.role || 'aluno';

        const token = jwt.sign({ id: usuarioEncontrado.id, email: usuarioEncontrado.email, role: roleDoUsuario }, JWT_SECRET, {expiresIn: "12h"})
        
        // Remove a senha antes de retornar os dados do usuário
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;
        
        // Garante que a role está no objeto retornado
        usuarioSemSenha.role = roleDoUsuario;

        return {
          mensagem: "Login realizado com sucesso",
          token: token,
          usuario: usuarioSemSenha
        }
}

//! Editar usuário
const editarUsuarioService = async (idUsuario, novosDados) => {
    const dadosParaAtualizar = {};

    if (novosDados.senha) {
        if (novosDados.senha.length < 6) {
            throw new Error ("A nova senha deve ter pelo menos 6 digitos!"); 
        }
        const salt = await bcrypt.genSalt(10);
        dadosParaAtualizar.senha = await bcrypt.hash(novosDados.senha, salt);
    }
    
    if (novosDados.nome) {
        dadosParaAtualizar.nome = novosDados.nome; 
    }

    if (novosDados.email) {
        dadosParaAtualizar.email = novosDados.email;
    }

    if (novosDados.temaDeInteresse) {
        dadosParaAtualizar.temaDeInteresse = novosDados.temaDeInteresse;
    }

    if (Object.keys(dadosParaAtualizar).length === 0) {
        throw new Error ("Nenhum dado válido para atualizar.");
    }

    const resultado = await atualizarUsuario(idUsuario, dadosParaAtualizar);

    return resultado;
}

//! Deletar 
const deletarUsuarioService = async (idUsuario) => {
    const resultado = await deletarUsuario(idUsuario);
    return resultado;
};

//! solicita a recuperação de senha
const solicitarRecuperacao = async (email) => {
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    //? gera o token de recuperação e define a expiração pra 1 hora
    const token = crypto.randomBytes(4).toString('hex');
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1); 

    await atualizarUsuario(usuario.id, {
        resetPasswordToken: token,
        resetPasswordExpires: expiracao.toISOString()
    });

    // 🔥 Envio de E-mail via Resend
    const { error } = await resend.emails.send({
        from: REMETENTE,
        to: email,
        subject: 'IAra - Recuperação de Senha',
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                <h2 style="color:#420583;">Recuperação de Senha</h2>
                <p>Olá! Use o código abaixo para criar uma nova senha na IAra:</p>
                <div style="background:#e2e8f0;padding:12px;text-align:center;font-size:24px;font-weight:bold;letter-spacing:4px;border-radius:8px;margin:16px 0;">
                    ${token}
                </div>
                <p style="font-size:12px;color:#64748b;">Este código expira em 1 hora.</p>
            </div>
        `
    });

    if (error) {
        console.error('[usuarioService] Erro ao enviar e-mail de recuperação:', error);
        throw new Error('Falha ao enviar e-mail de recuperação.');
    }

    return { message: "E-mail enviado com sucesso" };
};

//! realizar reset de senha
 const realizarResetSenha = async (token, novaSenha) => {
    
    const usuario = await buscarUsuarioPorToken(token);

    if (!usuario) {
        throw new Error('Token inválido ou expirado.');
    }

    const agora = new Date();
    const dataToken = new Date(usuario.resetPasswordExpires);
    if (agora > dataToken) {
        throw new Error('O código de recuperação expirou.');
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await atualizarUsuario(usuario.id, {
        senha: senhaHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
    });

    // 🔥 Envio de E-mail de confirmação via Resend
    const { error } = await resend.emails.send({
        from: REMETENTE,
        to: usuario.email,
        subject: 'IAra - Senha alterada com sucesso',
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border-radius:12px;background:#f0fdf4;border:1px solid #86efac;">
                <h2 style="color:#15803d;">Senha Atualizada!</h2>
                <p>Olá!</p>
                <p>Passando para avisar que sua senha na plataforma IAra foi alterada com sucesso.</p>
                <p style="font-size:12px;color:#64748b;margin-top:20px;">Se não foi você quem fez isso, entre em contato com o suporte imediatamente.</p>
            </div>
        `
    });

    if (error) {
        console.error('[usuarioService] Erro ao enviar e-mail de confirmação de senha:', error);
    }

    return { message: "Senha alterada com sucesso" };
};

export {cadastrarUsuarioService, loginUsuarioService, editarUsuarioService, deletarUsuarioService, solicitarRecuperacao, realizarResetSenha} 