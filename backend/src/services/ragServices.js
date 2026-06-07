// backend/src/services/ragServices.js

import { PineconeStore }                  from "@langchain/pinecone";
import { Pinecone }                       from "@pinecone-database/pinecone";
import { Embeddings }                     from "@langchain/core/embeddings";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import 'dotenv/config';
import { extrairTextoDoDrive, listarArquivosDaPasta } from './driveService.js';


// ─── Helper: cria instância do Pinecone sob demanda (não no topo do arquivo) ──
const getPinecone = () => new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const getPineconeIndex = () => getPinecone().index(process.env.PINECONE_INDEX);


// ─── Classe customizada de embeddings ─────────────────────────────────────────
class GeminiCustomEmbeddings extends Embeddings {
    constructor() { super({}); }

    async _chamarAPI(texto) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    model:   'models/gemini-embedding-001',
                    content: { parts: [{ text: texto }] },
                }),
            }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Google API Error');
        return data.embedding.values;
    }

    async embedQuery(text)      { return await this._chamarAPI(text); }
    async embedDocuments(texts) {
        const vectors = [];
        for (const t of texts) {
            vectors.push(await this._chamarAPI(t));
            await new Promise(r => setTimeout(r, 500));
        }
        return vectors;
    }
}

const embeddings = new GeminiCustomEmbeddings();


// ─── Remove campos aninhados que o Pinecone rejeita ───────────────────────────
function limparMetadata(metadata) {
    const limpa = {};
    for (const [chave, valor] of Object.entries(metadata)) {
        if (chave === 'loc') continue;
        if (
            typeof valor === 'string'  ||
            typeof valor === 'number'  ||
            typeof valor === 'boolean' ||
            (Array.isArray(valor) && valor.every(v => typeof v === 'string'))
        ) {
            limpa[chave] = valor;
        } else {
            limpa[chave] = JSON.stringify(valor);
        }
    }
    return limpa;
}


// ─── Aprender um único arquivo ────────────────────────────────────────────────
export const aprenderNovaAula = async (idDoArquivoNoDrive) => {
    const textoExtraido = await extrairTextoDoDrive(idDoArquivoNoDrive);
    await salvarDocumentoNoPinecone(textoExtraido, {
        origem:          'Google Drive',
        arquivoId:       idDoArquivoNoDrive,
        dataAprendizado: new Date().toISOString(),
    });
    console.log(`✅ IAra aprendeu o conteúdo com sucesso!`);
};


// ─── Treinar todos os PDFs de uma pasta ──────────────────────────────────────
export const treinarTodosOsArquivosDaPasta = async (folderId) => {
    console.log(`🔍 Procurando PDFs na pasta: ${folderId}...`);

    try {
        const pinecone  = getPinecone();
        const descricao = await pinecone.describeIndex(process.env.PINECONE_INDEX);
        console.log('🔎 [DIAGNÓSTICO PINECONE] Configuração do índice:');
        console.log(`   Nome:      ${descricao.name}`);
        console.log(`   Dimension: ${descricao.dimension}  ← deve ser 3072 para gemini-embedding-001`);
        console.log(`   Metric:    ${descricao.metric}`);
        console.log(`   Status:    ${descricao.status?.state}`);

        if (descricao.dimension !== 3072) {
            console.error(`\n❌ [ERRO DE CONFIGURAÇÃO] O índice tem ${descricao.dimension} dimensões.`);
            throw new Error(`Dimensão do índice incompatível: esperado 3072, encontrado ${descricao.dimension}.`);
        }
    } catch (e) {
        if (e.message.includes('incompatível')) throw e;
        console.warn('⚠️  Não consegui verificar o índice:', e.message);
    }

    const arquivos = await listarArquivosDaPasta(folderId);
    if (!arquivos?.length) {
        console.log('Nenhum PDF encontrado na pasta.');
        return 'Nenhum arquivo novo para aprender.';
    }

    console.log(`\n📚 Encontrei ${arquivos.length} arquivos. Iniciando aprendizado...`);

    for (const arquivo of arquivos) {
        console.log(`\n🧠 Aprendendo: ${arquivo.name}`);
        try {
            await aprenderNovaAula(arquivo.id);
        } catch (erro) {
            console.error(`❌ Erro em "${arquivo.name}": ${erro.message}`);
        }
    }

    console.log('\n🎉 Treinamento da pasta concluído!');
    return `Treinamento finalizado. ${arquivos.length} arquivos processados.`;
};


// ─── Salvar documento no Pinecone ─────────────────────────────────────────────
export const salvarDocumentoNoPinecone = async (textoBruto, metadados = {}) => {
    const textoLimpo = textoBruto.replace(/\0/g, '').replace(/\u0000/g, '').trim();
    if (!textoLimpo) throw new Error('O texto do PDF ficou vazio após a limpeza.');

    const splitter    = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const docs        = await splitter.createDocuments([textoLimpo], [metadados]);
    const docsValidos = docs.filter(doc => doc.pageContent?.trim().length > 0);
    if (!docsValidos.length) throw new Error('O fatiador não gerou nenhum bloco válido.');

    console.log(`⏳ Vetorizando ${docsValidos.length} pedaços via API do Gemini...`);

    const records = [];

    for (let i = 0; i < docsValidos.length; i++) {
        const doc   = docsValidos[i];
        const texto = doc.pageContent;

        process.stdout.write(`  → Pedaço ${i + 1}/${docsValidos.length}... `);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    model:   'models/gemini-embedding-001',
                    content: { parts: [{ text: texto }] },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(`⚠️  Erro da API Gemini: ${data.error?.message} — pedaço ignorado.`);
            continue;
        }

        const vetor = data.embedding?.values;

        if (!Array.isArray(vetor) || vetor.length === 0) {
            console.log(`⚠️  Vetor vazio — pedaço ignorado.`);
            continue;
        }

        records.push({
            id:     `${metadados.arquivoId}-pedaco-${i}`,
            values: vetor,
            metadata: {
                ...limparMetadata(doc.metadata),
                text: texto,
            },
        });

        process.stdout.write(`✓ (${vetor.length}d)\n`);

        if (i < docsValidos.length - 1) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    if (!records.length) {
        throw new Error('Todos os vetores vieram vazios. Verifique a cota da API.');
    }

    // Busca o host do índice sob demanda
    const pinecone  = getPinecone();
    const descricao = await pinecone.describeIndex(process.env.PINECONE_INDEX);
    const host      = descricao.host;

    console.log(`🚀 Salvando ${records.length} registros no Pinecone...`);

    const LOTE = 100;
    for (let i = 0; i < records.length; i += LOTE) {
        const lote = records.slice(i, i + LOTE);

        const response = await fetch(`https://${host}/vectors/upsert`, {
            method:  'POST',
            headers: {
                'Api-Key':      process.env.PINECONE_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vectors: lote }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`\n❌ [ERRO DO SERVIDOR PINECONE]`, JSON.stringify(errorData, null, 2));
            throw new Error(`O servidor recusou os dados: ${response.status}`);
        }

        console.log(`  → ${Math.min(i + LOTE, records.length)}/${records.length} salvos com sucesso ✓`);
    }

    return 'Documento aprendido e guardado na memória da IAra!';
};


// ─── Consultar a IA ───────────────────────────────────────────────────────────
export const consultarIA = async (pergunta) => {
    try {
        console.log(`\n🗣️ Aluno perguntou: "${pergunta}"`);
        console.log(`⏳ Buscando conhecimentos no Pinecone...`);

        // Instancia o índice sob demanda
        const pineconeIndex = getPineconeIndex();
        const vectorStore   = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
        const retriever     = vectorStore.asRetriever({ k: 3 });

        const docs = await retriever.invoke(pergunta);
        console.log(`📚 Encontrei ${docs.length} blocos de texto para basear a resposta.`);
        const contexto = docs.map(doc => doc.pageContent).join('\n\n');

        console.log(`🧠 Pensando na melhor resposta pedagógica...`);

        const promptTexto = `
Você é a IAra, uma inteligência artificial educadora e companheira de aprendizagem.

SEU PROPÓSITO:
Auxiliar pessoas das comunidades originárias, ribeirinhas e mulheres em situação de vulnerabilidade na construção da autonomia através do empreendedorismo e da inclusão digital, ajudando-as a fazer a "leitura do seu próprio mundo".

SUA PEDAGOGIA (Inspirada em Paulo Freire):
VALORIZE O SABER DE EXPERIÊNCIA: Reconheça que a aluna não é um pote vazio. Ela já possui saberes valiosos de sua vivência. Conecte a tecnologia a esses saberes.
PROBLEMATIZE, NÃO DÊ RESPOSTAS PRONTAS: Provoque a reflexão.
HORIZONTALIDADE E AFETO: Construa o conhecimento "com" a aluna, de forma horizontal, dialogada, usando linguagem simples, acolhedora e amorosa.

REGRAS DE FORMATAÇÃO (OBRIGATÓRIO):
MÁXIMO DE UM PARÁGRAFO. Termine sempre com uma pergunta simples.

REGRAS DE CONHECIMENTO:
SOBRE AS AULAS: use ESTRITAMENTE o CONTEXTO abaixo. Se não estiver no contexto, diga com carinho que ainda não está no material.
SOBRE O MUNDO: use seu conhecimento geral livremente, mantendo o parágrafo único.

CONTEXTO DA AULA:
${contexto}

PERGUNTA DO ALUNO: ${pergunta}
RESPOSTA DA IARA (Curta, em tom de conversa):
        `;

        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

        console.log(`🔍 Consultando modelos disponíveis...`);
        const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}`);
        const listData = await listResp.json();

        if (!listResp.ok) throw new Error('Falha ao listar modelos do Google: ' + listData.error?.message);

        const modelosTexto = listData.models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));

        const nomeModelo = modelosTexto.find(m => m.name.includes('gemini-1.5-flash'))?.name
                        || modelosTexto.find(m => m.name.includes('gemini-1.5-pro'))?.name
                        || modelosTexto.find(m => m.name.includes('gemini-2'))?.name
                        || modelosTexto.find(m => m.name.includes('gemini'))?.name;

        if (!nomeModelo) throw new Error('Nenhum modelo Gemini compatível encontrado na sua conta.');

        console.log(`🎯 Modelo escolhido: ${nomeModelo}`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${nomeModelo}:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: promptTexto }] }],
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Erro desconhecido na API do Google');
        }

        console.log(`✅ Resposta gerada e enviada!`);
        return data.candidates[0].content.parts[0].text;

    } catch (erro) {
        console.error('\n❌ [RAIO-X] ERRO VERDADEIRO NA CONSULTA:', erro);
        throw erro;
    }
};