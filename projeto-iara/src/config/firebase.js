//?Essa pasta serve para construir a configuração do firebase
import admin from 'firebase-admin'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monta o caminho apontando para a raiz do projeto-iara
const caminhoDaChave = path.resolve(__dirname, '../../chaveJsonFirebaseFirestore.json');

// Lemos o arquivo fisicamente e transformamos em JSON
const arquivoBruto = fs.readFileSync(caminhoDaChave, 'utf8');
const contaDeServico = JSON.parse(arquivoBruto);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(contaDeServico)
  });
}

const db = admin.firestore(); //? inicaliza o firestore atribuindo a variavel db
const auth = admin.auth(); //? inicializa o firebase auth atribuindo a variavel auth

export { 
  db, 
  auth,
  admin 
}; //? modulos exportados para utilizarmos em outros locais