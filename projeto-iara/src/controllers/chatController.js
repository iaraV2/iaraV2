
import {processarNovaMensagem, buscarHistoricoUsuario} from '../services/chatService.js'; 

export const enviarMensagemController = async (req, res) => {
   try {
        const { mensagem } = req.body;

        // O seu novo RAG em Node.js assume o controle aqui!
        const respostaDaIA = await consultarIA(mensagem);

        // Opcional: Aqui você pode salvar a pergunta e a resposta no seu Firestore
        await salvarNoHistoricoFirestore(req.userId, mensagem, respostaDaIA);

        res.status(200).json({ 
            resposta: respostaDaIA 
        });

    } catch (error) {
        console.error("Erro no Chatbot:", error);
        res.status(500).json({ erro: "A IAra está descansando no momento. Tente novamente mais tarde." });
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