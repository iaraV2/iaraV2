
import {processarNovaMensagem, buscarHistoricoUsuario} from '../services/chatService.js'; 

export const enviarMensagemController = async (req, res) => {
   try {
        const { mensagem } = req.body;
        const idUsuario = req.userId; 

        const respostaDaIA = await processarNovaMensagem(idUsuario, mensagem);

        res.status(200).json({ 
            resposta: respostaDaIA 
        });

    } catch (error) {
        console.error("Erro no ChatController:", error);
        res.status(500).json({ erro: "Erro interno ao enviar a mensagem." });
    }
};



export const buscarHistoricoController = async (req, res) => {
    try {
        const idUsuario = req.userId;
        const historico = await buscarHistoricoUsuario(idUsuario);
        
        return res.status(200).json(historico);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};