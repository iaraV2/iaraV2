import { google } from 'googleapis';
import * as pdf from 'pdf-parse';
import 'dotenv/config';

//? Configuração de autenticação para acessar o Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: './chave-google-drive.json', 
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });


 //? Baixa um PDF do Drive e extrai o texto bruto dele 
export const extrairTextoDoDrive = async (fileId) => {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const buffer = Buffer.from(response.data);
    const data = await pdf(buffer);

    return data.text; //? retorna o texto extraído do PDF
  } catch (error) {
    console.error("Erro ao ler arquivo do Drive:", error);
    throw new Error("Não consegui ler o material da aula.");
  }
};