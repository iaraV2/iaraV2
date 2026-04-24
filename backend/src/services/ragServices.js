//! importações tradicionais do Langchain
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//! importações específicas para o LCEL
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import 'dotenv/config';

//! Importação dos serviços de leitura do Drive e de interação com o Pinecone
import { extrairTextoDoDrive } from './services/driveService.js';
import { salvarDocumentoNoPinecone } from './services/ragService.js';




//? Instancia o Pinecone (banco de vetores) para guardar os vetores (conhecimento)
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);


//? Instancia do ollama pra transformar texto em números (embeddings)
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", 
});

//? Instancia do Google Gemini, a llm responsavel por responder as perguntas dos alunos

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", 
  apiKey: process.env.GOOGLE_API_KEY,
});


//! fase de aprendizado: recebe o texto bruto do material da aula, quebra em pedaços, transforma em vetores e guarda no Pinecone

//? Função principal para aprender uma nova aula: recebe o ID do arquivo no Drive, extrai o texto, e salva no Pinecone
const aprenderNovaAula = async (idDoArquivoNoDrive) => {
  const textoExtraido = await extrairTextoDoDrive(idDoArquivoNoDrive);

  await salvarDocumentoNoPinecone(textoExtraido, {
    origem: "Google Drive",
    arquivoId: idDoArquivoNoDrive,
    dataAprendizado: new Date().toISOString()
  });

  console.log("IAra aprendeu o conteúdo com sucesso!");
};

//? Função para salvar o texto extraído no Pinecone, transformando em vetores e guardando com metadados
export const salvarDocumentoNoPinecone = async (textoBruto, metadados = {}) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([textoBruto], [metadados]);

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
    });

    return "Documento aprendido e guardado na memória da IAra!";
};


//! fase de consulta: recebe a pergunta do aluno, busca o contexto relevante no Pinecone, e gera a resposta usando o Gemini

export const consultarIA = async (pergunta) => {
    
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex }); 
    const retriever = vectorStore.asRetriever({ k: 3 });    

    const prompt = ChatPromptTemplate.fromTemplate(`
      Você é a IAra, uma inteligência artificial companheira de aprendizagem.
      
      SEU PROPÓSITO:
      Auxiliar pessoas das comunidades originárias, ribeirinhas e mulheres em situação de vulnerabilidade na construção de conhecimentos sobre empreendedorismo e inclusão digital.

      SUA PEDAGOGIA:
      Sua abordagem é fortemente inspirada na educação popular de Paulo Freire, Carlos Rodrigues Brandão e Madalena Freire.
      - Use uma linguagem extremamente simples, acolhedora, afetuosa e acessível.
      - NUNCA use jargões técnicos de tecnologia ou negócios sem explicá-los com analogias do dia a dia da comunidade (ex: rios, pesca, artesanato, feira).
      - Valorize o saber popular. O aluno não é uma tábua rasa, ele tem conhecimentos de vida que devem ser respeitados.
      - Seja encorajadora e construa a resposta "com" o aluno, não apenas entregue a resposta pronta.

      REGRA DE CONHECIMENTO:
      Use ESTRITAMENTE os materiais da aula fornecidos no CONTEXTO abaixo para fundamentar sua resposta. 
      Se a informação solicitada não estiver no contexto, seja honesta. Diga com carinho que ainda não aprendeu sobre isso no material da aula, mas incentive a curiosidade do aluno.

      CONTEXTO DA AULA: 
      {context}

      PERGUNTA DO ALUNO: {input}
      RESPOSTA DA IARA:
    `);

    // A MÁGICA MODERNA (LCEL): Nossa Linha de Montagem
    const chain = RunnableSequence.from([
        {
            // Passo 1: Busca o contexto no Pinecone e junta os textos
            context: async (input) => {
                const docs = await retriever.invoke(input);
                return docs.map(doc => doc.pageContent).join("\n\n");
            },
            // Passo 2: Repassa a pergunta inalterada
            input: (input) => input
        },

        prompt,
        llm,
        new StringOutputParser()
    ]);

    // Executa a linha de montagem inteira
    const response = await chain.invoke(pergunta);
    
    return response;
};