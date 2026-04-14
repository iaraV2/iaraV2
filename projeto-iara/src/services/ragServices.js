// src/services/ragService.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import 'dotenv/config';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// 2. Instanciamos o Tradutor (Ollama Embeddings - rodando na sua máquina)
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", 
});

// 3. Instanciamos o Cérebro (Gemini)
const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash", 
  apiKey: process.env.GOOGLE_API_KEY,
});

// ============================================================================
// FASE 1: INGESTÃO (Substitui o fluxo da Esquerda no n8n)
// Lê um texto novo, corta em pedaços e salva no Pinecone
// ============================================================================
export const salvarDocumentoNoPinecone = async (textoBruto, metadados = {}) => {
    
    // Substitui a caixinha "Recursive Character Text Splitter"
    // Corta o texto a cada 1000 letras, com uma sobreposição de 200 letras para não cortar ideias pela metade
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([textoBruto], [metadados]);

    // Substitui a caixinha "Pinecone Vector Store"
    // Ele pega os pedaços, manda pro Ollama virar números, e salva no Pinecone
    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
    });

    return "Documento aprendido e guardado na memória da IAra!";
};


// ============================================================================
// FASE 2: CONSULTA (Substitui o fluxo da Direita no n8n)
// Recebe a pergunta, busca no Pinecone, junta tudo e manda pro Gemini
// ============================================================================
export const consultarIA = async (pergunta) => {
    
    // 1. Conecta no Pinecone existente e prepara o "Buscador" (Retriever)
    // Ele vai trazer os 3 pedaços de texto que mais parecem com a pergunta
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
    const retriever = vectorStore.asRetriever({ k: 3 }); 

    // 2. Criamos as instruções (Prompt) para o Gemini
    const prompt = ChatPromptTemplate.fromTemplate(`
      Você é a IAra, uma assistente virtual educacional simpática e inteligente.
      Use o CONTEXTO abaixo (que são materiais do professor) para responder à PERGUNTA do aluno.
      Se a resposta não estiver no contexto, seja honesta e diga que não encontrou essa informação nos materiais da aula. Não invente coisas.

      CONTEXTO: 
      {context}

      PERGUNTA: {input}
      RESPOSTA:
    `);

    // 3. Substitui as caixinhas "Question and Answer Chain"
    // O LangChain cria a corrente: Pega o contexto -> Joga no Prompt -> Manda pro LLM
    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });
    const retrievalChain = await createRetrievalChain({ retriever, combineDocsChain });

    // 4. Executa a mágica e devolve só o texto da resposta
    const response = await retrievalChain.invoke({ input: pergunta });
    
    return response.answer;
};