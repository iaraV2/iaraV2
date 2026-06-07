

import { processarNovaMensagem, buscarHistoricoUsuario } from '../services/chatService.js';
import { treinarTodosOsArquivosDaPasta }                from '../services/ragServices.js';
import { listarProcessados }                             from '../models/monitorModel.js';
import { verificarPasta }                               from '../services/monitorService.js';


//! Enviar mensagem para a IAra
export const enviarMensagemController = async (req, res) => {
    try {
        const { mensagem } = req.body;
        const idUsuario    = req.userId;
        const respostaDaIA = await processarNovaMensagem(idUsuario, mensagem);
        res.status(200).json({ resposta: respostaDaIA });
    } catch (error) {
        console.error("Erro no ChatController:", error);
        res.status(500).json({ erro: "Erro interno ao enviar a mensagem." });
    }
};


//! Buscar histórico do usuário
export const buscarHistoricoController = async (req, res) => {
    try {
        const idUsuario = req.userId;
        const historico = await buscarHistoricoUsuario(idUsuario);
        res.status(200).json(historico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//! Admin: re-treinar manualmente todos os arquivos de uma pasta
export const treinarIAController = async (req, res) => {
    try {
        const { folderId } = req.body;
        if (!folderId) {
            return res.status(400).json({ erro: "Você precisa enviar o folderId." });
        }

        // Roda em background para não travar o request
        treinarTodosOsArquivosDaPasta(folderId)
            .then(r  => console.log("✅ Treinamento manual finalizado:", r))
            .catch(e  => console.error("❌ Erro no treinamento manual:", e));

        res.status(200).json({
            mensagem: "Treinamento iniciado em segundo plano. Acompanhe os logs do servidor."
        });
    } catch (error) {
        console.error("Erro ao iniciar treino:", error);
        res.status(500).json({ erro: "Falha ao iniciar o processamento." });
    }
};


//! Admin: ver quais arquivos já foram aprendidos pelo monitor
export const statusMonitorController = async (req, res) => {
    try {
        const arquivos = await listarProcessados();
        res.status(200).json({
            total:    arquivos.length,
            arquivos, // [{ fileId, nome, processadoEm }]
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};


//! Admin: força uma verificação da pasta agora sem esperar o próximo intervalo
export const verificarAgora = async (req, res) => {
    try {
        // Roda em background e responde imediatamente
        verificarPasta()
            .then(() => console.log("✅ Verificação manual concluída."))
            .catch(e  => console.error("❌ Erro na verificação manual:", e));

        res.status(200).json({
            mensagem: "Verificação da pasta iniciada. Acompanhe os logs do servidor."
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};