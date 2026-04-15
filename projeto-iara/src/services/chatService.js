import { salvarHistorico, buscarHistorico } from '../models/chatModel.js';
import { consultarIA } from './ragServices.js';
import 'dotenv/config';


export const processarNovaMensagem = async (idUsuario, mensagem) => { 
    
    //? salva a pergunta do usuário no banco, para manter o histórico de conversa atualizado
    await salvarHistorico(idUsuario, mensagem, "usuario");
    
    let textoRespostaIA = "";

    try {
        //? Chama a arquitetura RAG (o LangChain no ragService) para processar o contexto e gerar a resposta
        textoRespostaIA = await consultarIA(mensagem);
        
    } catch (error) {
        console.error("Erro na comunicação com a IA:", error.message);
        textoRespostaIA = "Desculpe, estou aprendendo coisas novas no momento e fiquei indisponível. Pode tentar de novo em instantes?";
    }

    //? Salva a resposta gerada pela iara no firestore
    await salvarHistorico(idUsuario, textoRespostaIA, 'iara');

    //? Devolve a resposta final para o controller, que vai mandar pro frontend
    return textoRespostaIA;
};

export const buscarHistoricoUsuario = async (idUsuario) => {
    return await buscarHistorico(idUsuario);
};