

import { google } from 'googleapis';
import 'dotenv/config';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import { Readable } from 'stream';

// Configuração OAuth2 (Substituindo Service Account por OAuth2 para usar cota pessoal)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost' // Redirect URI configurada no Console
);

// Carregar o Refresh Token das variáveis de ambiente
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });

//! Realiza o upload de um arquivo PDF para uma pasta específica do Google Drive
export const uploadArquivoParaDrive = async (buffer, nomeArquivo, folderId) => {
  try {
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      console.warn("⚠️ [DriveService] GOOGLE_REFRESH_TOKEN não configurado. Upload ignorado.");
      return null;
    }

    console.log(`📤 [DriveService] Tentando upload OAuth2: "${nomeArquivo}"`);

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: nomeArquivo,
        parents: [folderId],
      },
      media: {
        mimeType: 'application/pdf',
        body: stream,
      },
      fields: 'id',
      supportsAllDrives: true,
    });

    console.log(`✅ [DriveService] Sucesso! Arquivo ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ [DriveService] ERRO NO UPLOAD OAUTH2:");
    console.error(`   Mensagem: ${error.message}`);
    return null;
  }
};


//! Lista todos os PDFs dentro de uma pasta do Google Drive pelo folderId
export const listarArquivosDaPasta = async (folderId) => {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: 'files(id, name)',
    });

    return response.data.files;
  } catch (error) {
    console.error("Erro ao listar arquivos da pasta no Drive:", error);
    throw new Error("Não consegui listar os arquivos.");
  }
};


//! Baixa um PDF do Drive pelo fileId e extrai o texto de todas as páginas
export const extrairTextoDoDrive = async (fileId) => {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const uint8Array = new Uint8Array(response.data);
    const fontPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/');

    const pdfDocument = await getDocument({ 
      data: uint8Array,
      standardFontDataUrl: fontPath,
      disableFontFace: true // Ignora a renderização visual e evita o travamento no Node
    }).promise;

    let textoCompleto = '';

    for (let numeroPagina = 1; numeroPagina <= pdfDocument.numPages; numeroPagina++) {
      const pagina = await pdfDocument.getPage(numeroPagina);
      const conteudo = await pagina.getTextContent();

      // Simplifica a extração garantindo um espaço entre os blocos de texto
      const textoDaPagina = conteudo.items.map(item => item.str).join(' ');
      textoCompleto += textoDaPagina + '\n';
    }

    const textoFinal = textoCompleto.trim();

    // Mostra no terminal um trecho do que ele conseguiu ler para confirmar
    console.log(`📄 [DEBUG] Texto extraído: ${textoFinal.substring(0, 80)}...`);

    if (!textoFinal || textoFinal.length < 5) {
      throw new Error("PDF sem texto detectável.");
    }

    return textoFinal;

  } catch (error) {
    throw new Error(error.message || "Não consegui ler o material da aula.");
  }
};