import admin from 'firebase-admin';

let contaDeServico;

if (process.env.FIREBASE_CREDENTIALS) {
  console.log("🔥 Usando Firebase via ENV");

  contaDeServico = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  
// chave do Fire Base de Ricardo 
// const caminhoDaChave = path.resolve(__dirname, '../../chaveJsonFirebaseFirestore.json');

  // 🔥 FIX PRINCIPAL
  contaDeServico.private_key = contaDeServico.private_key.replace(/\\n/g, '\n');

} else {
  console.log("📁 Usando Firebase via arquivo JSON");
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const caminhoDaChave = path.resolve(__dirname, '../../chaveJsonFirebaseFirestore.json');
  const arquivoBruto = fs.readFileSync(caminhoDaChave, 'utf8');

  contaDeServico = JSON.parse(arquivoBruto);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(contaDeServico)
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };