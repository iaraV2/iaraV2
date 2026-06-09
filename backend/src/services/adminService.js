// src/services/adminService.js

import { db } from '../config/firebase.js';
import { atualizarUsuario, deletarUsuario } from '../models/usuarioModel.js';
import { Resend } from 'resend';
import 'dotenv/config';

const resend    = new Resend(process.env.RESEND_API_KEY);
const REMETENTE = process.env.EMAIL_REMETENTE || 'IAra Suporte <onboarding@resend.dev>';


// ─── Helper: envia e-mail via Resend ─────────────────────────────────────────
async function enviarEmail({ para, assunto, html }) {
    const { error } = await resend.emails.send({ from: REMETENTE, to: para, subject: assunto, html });
    if (error) console.error('[adminService] Erro ao enviar e-mail:', error);
}


//! Lista todos os professores com cadastro pendente de aprovação
export const listarSolicitacoesService = async () => {
    console.log("🔍 [ADMIN] Buscando professores pendentes no banco...");
    
    const snap = await db.collection('usuarios')
        .where('role', '==', 'professor_pendente')
        .get();

    console.log(`📋 [ADMIN] Encontrei ${snap.size} professor(es) pendente(s) no Firestore.`);

    const solicitacoes = snap.docs.map(doc => ({
        id:       doc.id,
        nome:     doc.data().nome,
        email:    doc.data().email,
        criadoEm: doc.data().criadoEm,
    }));

    return solicitacoes.sort((a, b) => {
        const dataA = a.criadoEm?.toDate ? a.criadoEm.toDate() : new Date(0);
        const dataB = b.criadoEm?.toDate ? b.criadoEm.toDate() : new Date(0);
        return dataA - dataB;
    });
};


//! Aprova professor — muda role e notifica por e-mail
export const aprovarProfessorService = async (usuarioId) => {
    const doc = await db.collection('usuarios').doc(usuarioId).get();
    if (!doc.exists) throw new Error('Usuário não encontrado.');

    const usuario = doc.data();
    if (usuario.role !== 'professor_pendente') {
        throw new Error('Este usuário não tem uma solicitação pendente.');
    }

    await atualizarUsuario(usuarioId, {
        role:             'professor',
        tokenAprovacao:   null,   // limpa o token de aprovação
        aprovadoEm:       new Date().toISOString(),
    });

    // Notifica o professor por e-mail
    await enviarEmail({
        para:    usuario.email,
        assunto: '🎉 IAra — Seu cadastro como Professor foi aprovado!',
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border-radius:12px;background:#f0fdf4;border:1px solid #86efac;">
                <h2 style="color:#15803d;">Parabéns, ${usuario.nome}! 🌿</h2>
                <p>Seu cadastro como <strong>Professor</strong> na plataforma IAra foi aprovado.</p>
                <p>Você já pode fazer login e criar suas turmas. Bem-vindo à comunidade!</p>
            </div>
        `,
    });

    return { mensagem: `Professor "${usuario.nome}" aprovado com sucesso!` };
};


//! Rejeita professor — deleta o cadastro e notifica por e-mail
export const rejeitarProfessorService = async (usuarioId) => {
    const doc = await db.collection('usuarios').doc(usuarioId).get();
    if (!doc.exists) throw new Error('Usuário não encontrado.');

    const usuario = doc.data();
    if (usuario.role !== 'professor_pendente') {
        throw new Error('Este usuário não tem uma solicitação pendente.');
    }

    // Notifica antes de deletar (para ainda ter o email)
    await enviarEmail({
        para:    usuario.email,
        assunto: 'IAra — Solicitação de cadastro como Professor',
        html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border-radius:12px;background:#fff1f2;border:1px solid #fda4af;">
                <h2 style="color:#be123c;">Olá, ${usuario.nome}</h2>
                <p>Infelizmente sua solicitação de cadastro como Professor na plataforma IAra não foi aprovada desta vez.</p>
                <p>Se acredita que houve um engano, entre em contato com a equipe IAra.</p>
            </div>
        `,
    });

    await deletarUsuario(usuarioId);
    return { mensagem: `Solicitação de "${usuario.nome}" rejeitada e cadastro removido.` };
};


//! Lista todos os usuários da plataforma
export const listarTodosUsuariosService = async () => {
    const snap = await db.collection('usuarios').orderBy('criadoEm', 'desc').get();
    return snap.docs.map(doc => ({
        id:       doc.id,
        nome:     doc.data().nome,
        email:    doc.data().email,
        role:     doc.data().role,
        criadoEm: doc.data().criadoEm,
    }));
};


//! Admin força deleção de qualquer usuário
export const deletarUsuarioAdminService = async (usuarioId) => {
    const doc = await db.collection('usuarios').doc(usuarioId).get();
    if (!doc.exists) throw new Error('Usuário não encontrado.');
    await deletarUsuario(usuarioId);
    return { mensagem: 'Usuário deletado pelo administrador.' };
};