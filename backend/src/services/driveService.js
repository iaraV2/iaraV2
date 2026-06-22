

import { google } from 'googleapis';
import 'dotenv/config';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';

const auth = new google.auth.GoogleAuth({
  keyFile: './chaveJsonFirebaseFirestore.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });


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