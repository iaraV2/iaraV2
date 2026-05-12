//! aqui onde o cerebro de cada operação funciona os services 
//! nossos services de usuarios deve poder cadastrar, logar, deletar a propria conta, conversar com a IA

import { buscarUsuarioPorEmail, deletarUsuario, atualizarUsuario, buscarUsuarioPorToken} from "../models/usuarioModel.js";
import bcrypt from "bcryptjs"; //? importação do bcrypt biblioteca para criptografar senhas
import jwt from "jsonwebtoken";
import {adicionarUsuario} from "../models/usuarioModel.js"
import 'dotenv/config';
import nodemailer from 'nodemailer';
import crypto from 'crypto';



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

        const JWT_SECRET = process.env.JWT_SECRET 

        const token = jwt.sign({ id: usuarioEncontrado.id, email: usuarioEncontrado.email, role: usuarioEncontrado.role || 'aluno' }, JWT_SECRET, {expiresIn: "12h"})
        
        // Remove a senha antes de retornar os dados do usuário
        const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;

        return {
          mensagem: "Login realizado com sucesso",
          token: token,
          usuario: usuarioSemSenha
        }
}


//! Editar usuário

const editarUsuarioService = async (idUsuario, novosDados) => {  //? Objeto para armazenar apenas os dados válidos para atualização

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

    //? aqui configura o transporte de email usando nodemailer e envia o email de recuperação
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_SENHA 
        }
    });


    const mailOptions = {
        from: `IAra Suporte <${process.env.EMAIL_APP}>`,
        to: email,
        subject: 'IAra - Recuperação de Senha',
        text: `Olá! Use o código abaixo para criar uma nova senha:\n\n${token}\n\nEste código expira em 1 hora.`
    };

    return await transporter.sendMail(mailOptions);
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

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_SENHA 
        }
    });

    
    const mailOptions = {
        from: `IAra Suporte <${process.env.EMAIL_APP}>`,
        to: usuario.email,
        subject: 'IAra - Senha alterada com sucesso',
        text: `Olá!\n\nPassando para avisar que sua senha na IAra foi alterada com sucesso.\n\nSe não foi você quem fez isso, entre em contato com o suporte imediatamente.`
    };

    return await transporter.sendMail(mailOptions);
};

export {cadastrarUsuarioService, loginUsuarioService, editarUsuarioService, deletarUsuarioService, solicitarRecuperacao, realizarResetSenha} //? exporta esse arquivo atual para o controller poder acessar

